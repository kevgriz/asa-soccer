const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { action, email, password, name } = JSON.parse(event.body);

  if (action === "register") {
    const { data, error } = await supabase.auth.admin.createUser({
      email, password, email_confirm: true
    });
    if (error) return { statusCode: 400, body: JSON.stringify({ error: error.message }) };
    if (name && data.user) {
      await supabase.from("profiles").update({ name }).eq("id", data.user.id);
    }
    return { statusCode: 200, body: JSON.stringify({ user: data.user }) };
  }

  if (action === "login") {
    const anonClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    const { data, error } = await anonClient.auth.signInWithPassword({ email, password });
    if (error) return { statusCode: 400, body: JSON.stringify({ error: error.message }) };
    return { statusCode: 200, body: JSON.stringify({ user: data.user, session: data.session }) };
  }

  return { statusCode: 400, body: JSON.stringify({ error: "Unknown action" }) };
};
