const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendAlertEmail = async (to, temp) => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: to,
      subject: "🚨 Temperature Alert",
      html: `<h2>Temperature Alert</h2>
             <p>Temperature exceeded threshold:</p>
             <b>${temp}°C</b>`,
    });

    console.log("Email sent via Resend");
  } catch (err) {
    console.error("Resend error:", err);
  }
};

module.exports = { sendAlertEmail };
