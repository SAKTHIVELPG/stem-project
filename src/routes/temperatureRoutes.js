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

// COOL DOWN
setInterval(() => {
  if (!isSpiking && latestTemperature > 26.8) {
    latestTemperature -= 1;
    addTemperature(latestTemperature);
  }
}, 2000);

module.exports = { router, simulateSpike };
