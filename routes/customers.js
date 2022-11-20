const { Customer, validate } = require("../models/customer");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// Gets all the customer
router.get("/", async (req, res) => {
  try {
    const customer = await Customer.find();
    res.send(customer);
  } catch (ex) {
    for (let field in ex.errors) console.log(ex.errors[field].message);
  }
});

// Gets a certain customer by id
router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.find({ _id: req.params.id });
    res.send(customer);
  } catch (ex) {
    return res.status(404).send(ex.errors.message);
  }
});

// Creating a new Costumer
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
  });

  try {
    customer = await customer.save();
    console.log(customer);
  } catch (ex) {
    for (let field in ex.errors) console.log(ex.errors[field].message);
  }
  res.send(customer);
});

// Update for update
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },
      { new: true }
    );
    if (!customer) return res.status(404).send("The customer doesn t exist!");
    res.send(customer);
  } catch (ex) {
    for (let field in ex.errors) console.log(ex.errors[field].message);
  }
});

// Delete by id
router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.deleteOne({ _id: req.params.id });
    res.send(customer);
  } catch (ex) {
    for (let field in ex.errors) console.log(ex.errors[field].message);
  }
});

module.exports = router;
