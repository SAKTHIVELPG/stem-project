const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendAlertEmail = async (to, temp) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "arthurshelbyjr1708@gmail.com", // 🔥 FORCE YOUR EMAIL HERE
      subject: "🚨 Temperature Alert",
      html: `<h2>Temperature Alert</h2>
             <p>Temperature crossed threshold:</p>
             <b>${temp}°C</b>`,
    });

    console.log("EMAIL RESPONSE:", response);

  } catch (err) {
    console.error("RESEND ERROR:", err);
  }
};

module.exports = { sendAlertEmail };
