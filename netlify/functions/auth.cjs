const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const body = JSON.parse(event.body);
  const { action, email, password, name, phone, notifyEmail, notifyText, token, refreshToken } = body;

  if (action === "register") {
    const { data, error } = await supabase.auth.admin.createUser({
      email, password, email_confirm: true
    });
    if (error) return { statusCode: 400, body: JSON.stringify({ error: error.message }) };
    if (data.user) {
      await supabase.from("profiles").update({
        name: name || email.split("@")[0],
        phone: phone || null,
        notify_email: notifyEmail !== false,
        notify_text: notifyText === true,
      }).eq("id", data.user.id);
    }
    return { statusCode: 200, body: JSON.stringify({ user: data.user }) };
  }

  if (action === "login") {
    const anonClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { data, error } = await anonClient.auth.signInWithPassword({ email, password });
    if (error) return { statusCode: 400, body: JSON.stringify({ error: error.message }) };
    return { statusCode: 200, body: JSON.stringify({ user: data.user, session: data.session }) };
  }

  if (action === "refresh") {
    const anonClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { data, error } = await anonClient.auth.refreshSession({ refresh_token: refreshToken });
    if (error) return { statusCode: 401, body: JSON.stringify({ error: error.message }) };
    return { statusCode: 200, body: JSON.stringify({ session: data.session }) };
  }

  if (action === "updatePrefs") {
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
    await supabase.from("profiles").update({
      phone: phone || null,
      notify_email: notifyEmail !== false,
      notify_text: notifyText === true,
    }).eq("id", user.id);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  return { statusCode: 400, body: JSON.stringify({ error: "Unknown action" }) };
};
