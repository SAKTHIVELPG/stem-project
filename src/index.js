const express = require("express");
const cors = require("cors");

const { router: temperatureRoutes, simulateSpike } = require("./routes/temperatureRoutes");
const alertRoutes = require("./routes/alertRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.send("server running");
});

app.use("/api/temperature", temperatureRoutes);
app.post("/api/simulate-spike", simulateSpike);
app.use("/api", alertRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
