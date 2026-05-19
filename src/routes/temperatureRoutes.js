const express = require("express");

const router = express.Router();

let latestTemperature = null;

let lastUpdated = null;

let temperatureHistory = [];

// 🔥 ESP32 SENDS REAL DATA HERE

router.post("/update", (req, res) => {

  const { temperature } = req.body;

  if (temperature === undefined) {

    return res.status(400).json({
      error: "Temperature missing"
    });

  }

  latestTemperature = Number(temperature);

  lastUpdated = Date.now();

  // SAVE HISTORY

  temperatureHistory.push({

    value: latestTemperature,

    time: new Date()

  });

  // LIMIT GRAPH HISTORY

  if (temperatureHistory.length > 20) {

    temperatureHistory.shift();

  }

  console.log(
    "REAL TEMP:",
    latestTemperature
  );

  res.json({
    success: true
  });

});

// 🔥 WEBSITE FETCHES DATA HERE

router.get("/", (req, res) => {

  const connected =
    lastUpdated &&
    (Date.now() - lastUpdated < 10000);

  res.json({

    temperature: latestTemperature,

    history: temperatureHistory,

    connected: connected,

    lastUpdated: lastUpdated

  });

});

module.exports = router;
