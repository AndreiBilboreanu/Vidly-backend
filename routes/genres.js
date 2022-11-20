const { Genres, validate } = require("../models/genre");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Get courses
router.get("/", async (req, res) => {
  try {
    const genres = await Genres.find();
    res.send(genres);
  } catch (ex) {
    return res.status(404).send(ex.errors.message);
  }
});

// Get a specific course
router.get("/:id", async (req, res) => {
  try {
    const genre = await Genres.findById(req.params.id);
    res.send(genre);
  } catch (ex) {
    return res.status(404).send(ex.errors.message);
  }
});

// Post a course
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genres({
    name: req.body.name,
  });

  try {
    genre = await genre.save();
    console.log(genre);
  } catch (ex) {
    for (let field in ex.errors) console.log(ex.errors[field].message);
  }
  res.send(genre);
});

// Post for update
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const genre = await Genres.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!genre) return res.status(404).send("The genre doesn t exist!");
    res.send(genre);
  } catch (ex) {
    for (let field in ex.errors) console.log(ex.errors[field].message);
  }
});

// Delete by id
router.delete("/:id", async (req, res) => {
  try {
    const genre = await Genres.deleteOne({ _id: req.params.id });
    res.send(genre);
  } catch (ex) {
    for (let field in ex.errors) console.log(ex.errors[field].message);
  }
});

module.exports = router;
