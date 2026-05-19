const express = require("express");

const cors = require("cors");

const temperatureRoutes =
require("./routes/temperatureRoutes");

const app = express();

app.use(cors());

app.use(express.json());

// 🔥 MAIN ROUTE

app.use(
  "/api/temperature",
  temperatureRoutes
);

// 🔥 WEBSITE

app.use(
  express.static("public")
);

const PORT =
process.env.PORT || 10000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});
