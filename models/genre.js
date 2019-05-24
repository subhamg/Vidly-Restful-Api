const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

const Genre = mongoose.model("genre", genreSchema);

// Input Validation
function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .min(4)
      .required()
  };

  return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.validateGenre = validateGenre;
