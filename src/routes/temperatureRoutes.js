const express = require("express");
const router = express.Router();

let temperatureHistory = [];

const addTemperature = (value) => {
  const data = {
    value,
    time: new Date(),
  };

  temperatureHistory.push(data);

  if (temperatureHistory.length > 20) {
    temperatureHistory.shift();
  }
};

let latestTemperature = 26.8;
addTemperature(latestTemperature);

// GET CURRENT + HISTORY
router.get("/", (req, res) => {
  res.json({
    temperature: latestTemperature,
    history: temperatureHistory,
    status: "normal",
    timestamp: new Date(),
  });
});

// UPDATE TEMP
router.post("/", (req, res) => {
  const { temperature } = req.body;

  latestTemperature = temperature;
  addTemperature(temperature);

  res.json({ message: "Temperature updated" });
});

// SIMULATE SPIKE
const simulateSpike = (req, res) => {
  latestTemperature = 80;
  addTemperature(80);

  console.log("⚠️ SPIKE TRIGGERED");

  res.json({ message: "Spike simulated" });
};

module.exports = { router, simulateSpike };
