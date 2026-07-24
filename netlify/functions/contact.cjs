exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { type, message } = JSON.parse(event.body);

    const subjects = {
      add:      "ASA Tracker — Add Athlete Request",
      remove:   "ASA Tracker — Remove Athlete Request",
      schedule: "ASA Tracker — Schedule Correction",
      school:   "ASA Tracker — School or Conference Update",
      other:    "ASA Tracker — General Feedback",
    };

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ASA Tracker <onboarding@resend.dev>",
        to:   "kevgriz@gmail.com",
        subject: subjects[type] || subjects.other,
        text: message,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Resend error:", err);
      return { statusCode: 500, body: "Email failed to send" };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };

  } catch (err) {
    console.error("Function error:", err);
    return { statusCode: 500, body: "Server error" };
  }
};
