const express = require("express");

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send({ name: "Arnas" });
});

module.exports = userRouter;
