const express = require("express");
const cors = require("cors");
const path = require("path");

const { router: temperatureRoutes, simulateSpike } = require("./routes/temperatureRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 🔥 SERVE FRONTEND
app.use(express.static(path.join(__dirname, "../public")));

app.get("/health", (req, res) => {
  res.send("Server running");
});

app.use("/api/temperature", temperatureRoutes);
app.get("/api/simulate-spike", simulateSpike);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
