const express = require("express");
const router = express.Router();

// DEMO ALERT (NOT REAL SMS)
router.post("/alert", (req, res) => {
  console.log("🚨 ALERT TRIGGERED");

  res.json({
    message: "Alert triggered (demo)",
    status: "ok",
  });
});

module.exports = router;
