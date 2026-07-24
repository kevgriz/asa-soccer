const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { action, token, college, athleteName } = JSON.parse(event.body);

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };

  if (action === "getFavorites") {
    const [schools, athletes] = await Promise.all([
      supabase.from("favorite_schools").select("college").eq("user_id", user.id),
      supabase.from("favorite_athletes").select("athlete_name, college").eq("user_id", user.id),
    ]);
    return { statusCode: 200, body: JSON.stringify({
      schools: schools.data?.map(r => r.college) || [],
      athletes: athletes.data?.map(r => r.athlete_name) || [],
    })};
  }

  if (action === "toggleSchool") {
    const { data: existing } = await supabase.from("favorite_schools")
      .select("id").eq("user_id", user.id).eq("college", college).single();
    if (existing) {
      await supabase.from("favorite_schools").delete().eq("user_id", user.id).eq("college", college);
      return { statusCode: 200, body: JSON.stringify({ favorited: false }) };
    } else {
      await supabase.from("favorite_schools").insert({ user_id: user.id, college });
      return { statusCode: 200, body: JSON.stringify({ favorited: true }) };
    }
  }

  if (action === "toggleAthlete") {
    const { data: existing } = await supabase.from("favorite_athletes")
      .select("id").eq("user_id", user.id).eq("athlete_name", athleteName).single();
    if (existing) {
      await supabase.from("favorite_athletes").delete().eq("user_id", user.id).eq("athlete_name", athleteName);
      return { statusCode: 200, body: JSON.stringify({ favorited: false }) };
    } else {
      await supabase.from("favorite_athletes").insert({ user_id: user.id, athlete_name: athleteName, college });
      return { statusCode: 200, body: JSON.stringify({ favorited: true }) };
    }
  }

  return { statusCode: 400, body: JSON.stringify({ error: "Unknown action" }) };
};
