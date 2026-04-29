const express = require("express");
const router = express.Router();

router.post("/alert", (req, res) => {
  res.json({
    message: "Alert triggered (demo mode)",
    status: "ok"
  });
});

module.exports = router;
