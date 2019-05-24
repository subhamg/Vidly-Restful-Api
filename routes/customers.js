const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const express = require("express");
const router = express.Router();

const customerSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 20,
    minlength: 4,
    required: true
  },
  isGold: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    maxlength: 10,
    minlength: 4,
    required: true
  }
});

const Customer = mongoose.model("customers", customerSchema);

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });
  customer = await customer.save();
  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
    { new: true }
  );

  if (!customer) return res.status(404).send("The customer ID was not found");

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) return res.status(404).send("The requested ID was not found");
  res.send(customer);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) res.status(404).send("The ID requested was not found");
  res.send(customer);
});

function validateCustomer(customer) {
  const Schema = {
    name: Joi.string()
      .min(4)
      .max(20)
      .required(),
    phone: Joi.string()
      .min(4)
      .max(10)
      .required(),
    isGold: Joi.boolean()
  };
  return Joi.validate(customer, Schema);
}

module.exports = router;
