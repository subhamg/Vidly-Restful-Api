const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true
  }
});

const User = mongoose.model("Users", userSchema);

function validateUser(user) {
  const Schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };

  return Joi.validate(user, Schema);
}

exports.User = User;
exports.validateUser = validateUser;
