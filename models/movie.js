const mongoose = require("mongoose");
const { genreSchema } = require("../models/genre");
const Joi = require("joi");
const { number } = require("joi");

const Movie = mongoose.model(
  "Movies",
  new mongoose.Schema({
    title: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 255,
      required: true,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      min: 0,
      max: 255,
      default: 0,
    },
    dailyRentalRate: {
      type: Number,
      min: 0,
      max: 255,
      default: 0,
    },
  })
);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).max(255),
    dailyRentalRate: Joi.number().min(0).max(255),
  });
  return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;
