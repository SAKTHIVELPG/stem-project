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
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: "🚨 Temperature Alert",
      text: `Temperature exceeded! Current value: ${temp}°C`,
    });

    console.log("Email sent to", to);
  } catch (err) {
    console.error(err);
  }
};

module.exports = { sendAlertEmail };
