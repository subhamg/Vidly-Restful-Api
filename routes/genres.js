const express = require("express");
const router = express.Router();

const genres = [
  { id: 1, name: "Horror" },
  { id: 2, name: "Sci-Fi" },
  { id: 3, name: "Comedy" }
];

// HTTP Get request for all genres
router.get("/", (req, res) => {
  res.send(genres);
});

// POST request
router.post("/", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    name: req.body.name
  };

  genres.push(genre);
  res.send(genre);
});

// PUT request
router.put("/:id", (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id));

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found");

  const { error } = validateGenre(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;
  res.send(genre);
});

// DELETE
router.delete("/:id", (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre)
    return res
      .status(404)
      .send("The genre requested for the given ID was not found");

  const index = genres.indexOf(genre);
  genres.slice(index, 1);
  res.send(genre);
});

// Get request for a genre's ID
router.get("/:id", (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found");
  res.send(genre);
});

// Input Validation
function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .min(4)
      .required()
  };

  return Joi.validate(genre, schema);
}

module.exports = router;
