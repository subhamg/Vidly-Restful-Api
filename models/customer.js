const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

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

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
