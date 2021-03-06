const express = require("express");

const leaderboardRouter = express.Router();

leaderboardRouter.get("/", (req, res) => {
  res.send({
    top10: [
      { name: "Rokas", points: "417", img: "N/A" },
      { name: "Rokas", points: "417", img: "N/A" },
      { name: "Rokas", points: "417", img: "N/A" },
      { name: "Rokas", points: "417", img: "N/A" },
      { name: "Rokas", points: "417", img: "N/A" },
    ],
  });
});

module.exports = leaderboardRouter;
