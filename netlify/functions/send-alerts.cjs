const { createClient } = require('@supabase/supabase-js');

// Game schedule data — mirrors the Google Sheet structure
// This function checks for games starting in approximately 2 hours

const MONTH_NUMS = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };

function parseGameDate(dateStr, timeStr) {
  try {
    const [mon, day] = dateStr.trim().split(' ');
    const month = MONTH_NUMS[mon];
    if (month === undefined) return null;
    const d = parseInt(day);
    // Parse time e.g. "7:00 PM ET"
    const timeMatch = timeStr && timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeMatch) return null;
    let h = parseInt(timeMatch[1]);
    const m = parseInt(timeMatch[2]);
    const ampm = timeMatch[3].toUpperCase();
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    const date = new Date(2026, month, d, h, m, 0);
    return date;
  } catch { return null; }
}

exports.handler = async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // Fetch schedule from Google Sheet
  let games = [];
  try {
    const res = await fetch(process.env.SHEET_URL);
    const data = await res.json();
    games = data.games || [];
  } catch (err) {
    console.error('Failed to fetch schedule:', err);
    return { statusCode: 500, body: 'Failed to fetch schedule' };
  }

  // Find games starting in 1.5 to 2.5 hours from now (ET)
  const now = new Date();
  const windowStart = new Date(now.getTime() + 90 * 60 * 1000);
  const windowEnd   = new Date(now.getTime() + 150 * 60 * 1000);

  const upcomingGames = games.filter(g => {
    if (!g.time || g.time === 'TBA' || g.time === 'TBD') return false;
    const gd = parseGameDate(g.date, g.time);
    if (!gd) return false;
    return gd >= windowStart && gd <= windowEnd;
  });

  if (!upcomingGames.length) {
    console.log('No games in alert window');
    return { statusCode: 200, body: 'No games in window' };
  }

  console.log(`Found ${upcomingGames.length} games in alert window`);

  // Get all users with email alerts enabled
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, name, notify_email, favorite_athletes')
    .eq('notify_email', true);

  if (!profiles?.length) {
    console.log('No users with email alerts');
    return { statusCode: 200, body: 'No alert users' };
  }

  let alertsSent = 0;

  for (const profile of profiles) {
    const favAthletes = profile.favorite_athletes || [];
    if (!favAthletes.length) continue;

    // Find upcoming games involving this user's favorited athletes
    const relevantGames = upcomingGames.filter(g =>
      favAthletes.some(athlete => {
        // Match athlete to their college
        return g.college && favAthletes.includes(athlete);
      })
    );

    // Get games where the user's favorited athletes are playing
    const { data: favRows } = await supabase
      .from('favorite_athletes')
      .select('athlete_name, college')
      .eq('user_id', profile.id);

    if (!favRows?.length) continue;

    const userAlerts = [];
    for (const game of upcomingGames) {
      const matchingAthletes = favRows.filter(f => f.college === game.college);
      if (matchingAthletes.length) {
        userAlerts.push({ game, athletes: matchingAthletes.map(f => f.athlete_name) });
      }
    }

    if (!userAlerts.length) continue;

    // Build email
    const gameLines = userAlerts.map(({ game, athletes }) => {
      const opp = game.opponent.replace(' [!]', '').replace(/^at /, '');
      const homeAway = game.homeAway === 'Home' ? 'vs' : 'at';
      return `• ${athletes.join(', ')} — ${game.college} ${homeAway} ${opp} at ${game.time}`;
    }).join('\n');

    const emailBody = `Hi ${profile.name || 'there'},

Your favorited athletes have games starting soon!

${gameLines}

Follow along at: https://arlingtonsoccercollegegames.com

Go Arlington! ⚽
ASA College Soccer Tracker`;

    // Send via Resend
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
          subject: `Game Alert: Your athletes play today!`,
          text: emailBody,
        }),
      });

      if (emailRes.ok) {
        alertsSent++;
        console.log(`Alert sent to ${profile.email}`);
      } else {
        console.error(`Failed to send to ${profile.email}`);
      }
    } catch (err) {
      console.error(`Email error for ${profile.email}:`, err);
    }
  }

  return { statusCode: 200, body: `Alerts sent: ${alertsSent}` };
};
