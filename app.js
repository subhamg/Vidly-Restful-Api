const Joi = require("@hapi/joi");
const express = require("express");
const app = express();

app.use(express.json());

const genres = [
  { id: 1, name: "Horror" },
  { id: 2, name: "Sci-Fi" },
  { id: 3, name: "Comedy" }
];

// HTTP Get request for all genres
app.get("/api/genres", (req, res) => {
  res.send(genres);
});

// POST request
app.post("/api/genres", (req, res) => {
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
app.put("/api/genres/:id", (req, res) => {
  const genre = genres.find(c => c.id === parseInt(req.params.id));

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found");

  const { error } = validateGenre(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;
  res.send(genre);
});

// DELETE
app.delete("/api/genres/:id", (req, res) => {
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
app.get("/api/genres/:id", (req, res) => {
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

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening to port ${port}...`);
});
