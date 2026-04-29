const express = require("express");
const { sendOfflineAlertOnce } = require("../services/offlineAlertService");

const router = express.Router();

router.post("/send-alert", async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || typeof phone !== "string") {
    return res.status(400).json({ message: "phone is required" });
  }

  if (!message || typeof message !== "string") {
    return res.status(400).json({ message: "message is required" });
  }

  const sms = await sendOfflineAlertOnce({ phone, message });
  return res.json({
    message: sms.skipped ? "offline alert skipped" : "offline alert processed",
    sms
  });
});

module.exports = router;
