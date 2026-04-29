const express = require("express");
const router = express.Router();

let latestTemperature = 26.8;
let temperatureHistory = [];

let isSpiking = false;

// 📊 ADD TO HISTORY
const addTemperature = (value) => {
  temperatureHistory.push({
    value,
    time: new Date(),
  });

  if (temperatureHistory.length > 20) {
    temperatureHistory.shift();
  }
};

// INITIAL VALUE
addTemperature(latestTemperature);

// 📡 GET DATA
router.get("/", (req, res) => {
  res.json({
    temperature: latestTemperature,
    history: temperatureHistory,
    status: "normal",
  });
});

// ⚡ REAL-TIME SPIKE
const simulateSpike = (req, res) => {
  if (isSpiking) {
    return res.json({ message: "Already spiking" });
  }

  isSpiking = true;

  let temp = latestTemperature;

  console.log("⚡ Starting spike...");

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
