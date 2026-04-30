const express = require("express");
const router = express.Router();
const { sendAlertEmail } = require("../services/emailService");

let latestTemperature = 26.8;
let temperatureHistory = [];

let isSpiking = false;

// ALERT SETTINGS
let alertEmail = "";
let alertThreshold = 50;
let emailSent = false;

// STORE HISTORY
function addTemperature(value) {
  temperatureHistory.push({
    value,
    time: new Date(),
  });

  if (temperatureHistory.length > 20) {
    temperatureHistory.shift();
  }
}

// INITIAL VALUE
addTemperature(latestTemperature);

// 🔁 NORMAL TEMP FLUCTUATION (FIXED)
setInterval(() => {
  if (!isSpiking) {
    const randomChange = (Math.random() * 2 - 1); // -1 to +1
    latestTemperature = +(latestTemperature + randomChange).toFixed(1);
    addTemperature(latestTemperature);
  }
}, 2000);

// GET DATA
router.get("/", (req, res) => {
  res.json({
    temperature: latestTemperature,
    history: temperatureHistory,
    status: "normal",
  });
});

// SET ALERT
router.post("/set-alert", (req, res) => {
  const { email, threshold } = req.body;

  alertEmail = email;
  alertThreshold = Number(threshold);
  emailSent = false;

  res.json({ message: "Alert set" });
});

// 🧪 TEST EMAIL ROUTE (NEW)
router.get("/test-email", async (req, res) => {
  if (!alertEmail) {
    return res.json({ message: "Set email first" });
  }

  await sendAlertEmail(alertEmail, latestTemperature);
  res.json({ message: "Test email sent" });
});

// SPIKE
const simulateSpike = (req, res) => {
  if (isSpiking) {
    return res.json({ message: "Already spiking" });
  }

  isSpiking = true;
  let temp = latestTemperature;

  const interval = setInterval(() => {
    if (temp >= 80) {
      clearInterval(interval);
      isSpiking = false;
      emailSent = false; // reset for next spike
      return;
    }

    temp += 2;
    latestTemperature = temp;
    addTemperature(temp);

    console.log("Temp:", temp);

    if (temp >= alertThreshold && !emailSent && alertEmail) {
      console.log("Sending email...");
      sendAlertEmail(alertEmail, temp);
      emailSent = true;
    }

  }, 1000);

  res.json({ message: "Spike started" });
};

module.exports = { router, simulateSpike };
