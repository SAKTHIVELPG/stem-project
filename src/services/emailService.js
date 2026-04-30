const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendAlertEmail = async (to, temp) => {
  try {
    console.log("Sending email to:", to);
    console.log("Using email:", process.env.EMAIL_USER);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: "🚨 Temperature Alert",
      text: `Temperature exceeded threshold!\nCurrent value: ${temp}°C`,
    });

    console.log("SUCCESS:", info.response);

  } catch (err) {
    console.error("EMAIL FAILED:", err.message);
  }
};

module.exports = { sendAlertEmail };
