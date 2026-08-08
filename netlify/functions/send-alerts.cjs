const { createClient } = require('@supabase/supabase-js');

const MONTH_NUMS = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
const MONTH_ABBR = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function parseGameDateET(dateStr, timeStr) {
  try {
    if (!timeStr || timeStr === 'TBA' || timeStr === 'TBD') return null;

    // Parse the date — handles both "Aug 5" (plain text) and ISO "2026-08-05T04:00:00.000Z"
    let month, day;
    const s = String(dateStr).trim();
    if (s.match(/^\d{4}-\d{2}-\d{2}/)) {
      // ISO format from Google Sheets — use UTC date parts to get the ET date
      const d = new Date(s);
      month = d.getUTCMonth();
      day = d.getUTCDate();
    } else {
      // Plain text "Aug 5"
      const parts = s.split(' ');
      month = MONTH_NUMS[parts[0]];
      day = parseInt(parts[1]);
      if (month === undefined || isNaN(day)) return null;
    }

    // Parse the time
    const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeMatch) return null;
    let h = parseInt(timeMatch[1]);
    const m = parseInt(timeMatch[2]);
    const ampm = timeMatch[3].toUpperCase();
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;

    // Build ISO string with ET offset (-04:00 EDT) — JS handles date rollover automatically
    const pad = n => String(n).padStart(2, '0');
    const etString = `2026-${pad(month+1)}-${pad(day)}T${pad(h)}:${pad(m)}:00-04:00`;
    return new Date(etString);
  } catch { return null; }
}

exports.handler = async () => {
  console.log('send-alerts: starting at', new Date().toISOString());

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  let games = [];
  try {
    const res = await fetch(process.env.SHEET_URL + '?t=' + Date.now());
    const data = await res.json();
    games = data.games || [];
    console.log('send-alerts: fetched', games.length, 'games');
  } catch (err) {
    console.error('send-alerts: failed to fetch schedule:', err);
    return { statusCode: 500, body: 'Failed to fetch schedule' };
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() + 90 * 60 * 1000);
  const windowEnd   = new Date(now.getTime() + 180 * 60 * 1000);

  const upcomingGames = games.filter(g => {
    if (!g.time || g.time === 'TBA' || g.time === 'TBD') return false;
    const gd = parseGameDateET(g.date, g.time);
    if (!gd) return false;
    const inWindow = gd >= windowStart && gd <= windowEnd;
    if (inWindow) console.log('send-alerts: game in window:', g.college, g.date, g.time, '=', gd.toISOString());
    return inWindow;
  });

  console.log('send-alerts:', upcomingGames.length, 'games in alert window');
  if (!upcomingGames.length) return { statusCode: 200, body: 'No games in window' };

  const [{ data: allFavAthletes }, { data: allFavSchools }] = await Promise.all([
    supabase.from('favorite_athletes').select('user_id, athlete_name, college'),
    supabase.from('favorite_schools').select('user_id, college'),
  ]);

  console.log('send-alerts: fav athletes rows:', allFavAthletes?.length, 'fav schools rows:', allFavSchools?.length);

  const favAthletesByUser = {};
  (allFavAthletes || []).forEach(row => {
    if (!favAthletesByUser[row.user_id]) favAthletesByUser[row.user_id] = [];
    favAthletesByUser[row.user_id].push({ athlete: row.athlete_name, college: row.college });
  });

  const favSchoolsByUser = {};
  (allFavSchools || []).forEach(row => {
    if (!favSchoolsByUser[row.user_id]) favSchoolsByUser[row.user_id] = [];
    favSchoolsByUser[row.user_id].push(row.college);
  });

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, name, notify_email')
    .eq('notify_email', true);

  console.log('send-alerts: users with email alerts:', profiles?.length);

  let alertsSent = 0;

  for (const profile of (profiles || [])) {
    const userFavAthletes = favAthletesByUser[profile.id] || [];
    const userFavSchools  = favSchoolsByUser[profile.id]  || [];
    if (!userFavAthletes.length && !userFavSchools.length) continue;

    const userAlerts = [];
    for (const game of upcomingGames) {
      const matchingAthletes = userFavAthletes
        .filter(f => f.college === game.college)
        .map(f => f.athlete);
      const schoolFavorited = userFavSchools.includes(game.college);
      if (matchingAthletes.length || schoolFavorited) {
        userAlerts.push({ game, athletes: matchingAthletes });
      }
    }

    if (!userAlerts.length) continue;

    const gameLines = userAlerts.map(({ game, athletes }) => {
      const opp = (game.opponent || '').replace(' [!]', '').replace(/^at /, '');
      const homeAway = game.homeAway === 'Home' ? 'vs' : 'at';
      const who = athletes.length ? athletes.join(', ') : game.college;
      return `  - ${who} (${game.college} ${homeAway} ${opp}) at ${game.time}`;
    }).join('\n');

    const emailBody = `Hi ${profile.name || 'there'},\n\nYour favorited athletes/schools have games starting in a few hours!\n\n${gameLines}\n\nFollow along at: https://arlingtonsoccercollegegames.com\n\nGo Arlington!\nASA College Soccer Tracker`;

    try {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'ASA Tracker <alerts@arlingtonsoccercollegegames.com>',
          to: profile.email,
          subject: 'Game Alert: Your athletes play today!',
          text: emailBody,
        }),
      });
      if (emailRes.ok) {
        alertsSent++;
        console.log('send-alerts: alert sent to', profile.email);
      } else {
        const err = await emailRes.text();
        console.error('send-alerts: email failed for', profile.email, err);
      }
    } catch (err) {
      console.error('send-alerts: email error for', profile.email, err);
    }
  }

  console.log('send-alerts: done, alerts sent:', alertsSent);
  return { statusCode: 200, body: `Alerts sent: ${alertsSent}` };
};
