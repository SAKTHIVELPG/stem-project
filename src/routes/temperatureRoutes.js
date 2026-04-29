const express = require("express");
const {
  createSpikeReading,
  getHistory,
  getNextDemoReading,
  savePostedTemperature
} = require("../services/demoTemperatureService");
const { resetOfflineAlert } = require("../services/offlineAlertService");
const { sendAlertSms } = require("../services/smsService");

const router = express.Router();

router.use((req, _res, next) => {
  console.log(`Temperature route hit: ${req.method} ${req.originalUrl}`);
  next();
});

async function maybeSendHighTemperatureSms(reading) {
  if (reading.temperature <= 40) {
    return { sent: false, reason: "Temperature is below alert threshold" };
  }

  return sendAlertSms(`High Temperature Detected: ${reading.temperature} C`);
}

router.get("/", (_req, res) => {
  const reading = getNextDemoReading();
  resetOfflineAlert();
  console.log("Returning demo temperature:", reading.temperature);
  res.json(reading);
});

router.get("/history", (_req, res) => {
  res.json({ history: getHistory() });
});

router.post("/", async (req, res) => {
  const { temperature } = req.body;

  if (typeof temperature !== "number" || !Number.isFinite(temperature)) {
    return res.status(400).json({ message: "temperature must be a number" });
  }

  const reading = savePostedTemperature(temperature);
  const sms = await maybeSendHighTemperatureSms(reading);
  console.log("Temperature received:", reading.temperature);

  return res.status(201).json({
    message: "temperature stored",
    ...reading,
    sms
  });
});

async function simulateSpike(_req, res) {
  const reading = createSpikeReading();
  const sms = await maybeSendHighTemperatureSms(reading);

  return res.status(201).json({
    message: "temperature spike simulated",
    ...reading,
    sms
  });
}

module.exports = { router, simulateSpike };

