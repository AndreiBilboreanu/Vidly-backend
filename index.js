const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
require("dotenv").config();

mongoose
  .connect("mongodb://localhost/Vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(express.json());
app.use("/app/genres", genres);
app.use("/app/customers", customers);
app.use("/app/movies", movies);
app.use("/app/rentals", rentals);

// console.log(genres);

//Port
const port = process.env.PORT || 3001;
console.log(port);
app.listen(port, () => console.log(`Listening on port ${port}...`));
