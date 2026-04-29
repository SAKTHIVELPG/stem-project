const express = require("express");
const router = express.Router();

let latestTemperature = 26.8;

router.get("/", (req, res) => {
  res.json({
    temperature: latestTemperature,
    status: "normal",
    source: "demo",
    timestamp: new Date(),
  });
});

router.post("/", (req, res) => {
  const { temperature } = req.body;
  latestTemperature = temperature;
  res.json({ message: "Temperature updated" });
});

const simulateSpike = (req, res) => {
  latestTemperature = 80;
  res.json({ message: "Spike simulated" });
};

module.exports = { router, simulateSpike };
