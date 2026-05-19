const express = require("express");

const router = express.Router();

let latestTemperature = null;

let lastUpdated = null;

let temperatureHistory = [];

let wifiStatus = false;

let sensorStatus = false;

// RECEIVE SENSOR DATA

router.post("/update", (req, res) => {

  const {
    temperature,
    wifi,
    sensor
  } = req.body;

  latestTemperature =
  Number(temperature);

  wifiStatus = wifi;

  sensorStatus = sensor;

  lastUpdated =
  Date.now();

  temperatureHistory.push({

    value: latestTemperature,

    time: new Date()

  });

  // LIMIT GRAPH HISTORY

  if(temperatureHistory.length > 20){

    temperatureHistory.shift();

  }

  console.log(
    "REAL TEMP:",
    latestTemperature
  );

  res.json({
    success:true
  });

});

// SEND DATA TO WEBSITE

router.get("/", (req, res) => {

  const connected =
  lastUpdated &&
  (Date.now() - lastUpdated < 10000);

  res.json({

    temperature:
    latestTemperature,

    history:
    temperatureHistory,

    connected:
    connected,

    wifi:
    wifiStatus,

    sensor:
    sensorStatus,

    lastUpdated:
    lastUpdated

  });

});

module.exports = router;
