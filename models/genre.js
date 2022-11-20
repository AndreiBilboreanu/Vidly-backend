const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Action", "Romance", "Comedy", "Drama", "Fantasy", "Thriller"],
  },
});

const Genres = mongoose.model("Genres", genreSchema);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
  });
  return schema.validate(genre);
}

exports.Genres = Genres;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;
