const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    min: 5,
    max: 50,
  },
  email: {
    type: String,
    require: true,
    min: 5,
    max: 255,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    min: 5,
    max: 1024,
  },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get("jwtPrivateKey"));
  return token;
};

const User = mongoose.model("Users", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
