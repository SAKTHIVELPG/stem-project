const express = require("express");
const router = express.Router();

let latestTemperature = 26.8;
let temperatureHistory = [];

let isSpiking = false;

// Store history
const addTemperature = (value) => {
  temperatureHistory.push({
    value,
    time: new Date(),
  });

  if (temperatureHistory.length > 20) {
    temperatureHistory.shift();
  }
};

addTemperature(latestTemperature);

// GET API
router.get("/", (req, res) => {
  res.json({
    temperature: latestTemperature,
    history: temperatureHistory,
    status: "normal",
  });
});

// REAL SPIKE (BACKGROUND)
const simulateSpike = (req, res) => {
  if (isSpiking) {
    return res.json({ message: "Already running" });
  }

  isSpiking = true;

  let temp = latestTemperature;

  console.log("⚡ Spike started");

  const interval = setInterval(() => {
    if (temp >= 80) {
      clearInterval(interval);
      isSpiking = false;
      console.log("✅ Spike finished");
      return;
    }

    temp += 2;
    latestTemperature = temp;
    addTemperature(temp);

    console.log("Temp:", temp);
  }, 1000);

  res.json({ message: "Spike started" });
};

module.exports = { router, simulateSpike };
// AUTO COOL DOWN
setInterval(() => {
  if (!isSpiking && latestTemperature > 26.8) {
    latestTemperature -= 1;
    addTemperature(latestTemperature);
  }
}, 2000);
