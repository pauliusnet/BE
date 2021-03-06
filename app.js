const express = require("express");
const app = express();
const leaderboardRoutes = require("./routes/leaderboard");
const userRoutes = require("./routes/user");
require("dotenv/config");

//Define routes
app.use("/leaderboard", leaderboardRoutes);
app.use("/userDetails", userRoutes);

//Server start
app.listen(3000);
