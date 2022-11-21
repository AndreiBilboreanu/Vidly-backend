const express = require("express");
const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/app/genres", genres);
  app.use("/app/customers", customers);
  app.use("/app/movies", movies);
  app.use("/app/rentals", rentals);
  app.use("/app/users", users);
  app.use("/app/auth", auth);
  app.use(error);
};
