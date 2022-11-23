const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Genres, validate } = require("../models/genre");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Get genres
router.get("/", async (req, res) => {
  // throw new Error("Could not get the genres.");
  const genres = await Genres.find();
  res.send(genres);
});

// Get a specific genre
router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genres.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given id doesn t exist");
  res.send(genre);
});

// Post a genre
router.post("/", auth, async (req, res) => {
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

// Modify genres
router.put("/:id", auth, async (req, res) => {
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
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const genre = await Genres.deleteOne({ _id: req.params.id });
    res.send(genre);
  } catch (ex) {
    for (let field in ex.errors) console.log(ex.errors[field].message);
  }
});

module.exports = router;
