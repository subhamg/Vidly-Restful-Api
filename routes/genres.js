const { Genre, validateGenre } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// HTTP Get request for all genres
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

// POST request
router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
});

// PUT request
router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true
    }
  );

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found");

  res.send(genre);
});

// DELETE
router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre)
    return res
      .status(404)
      .send("The genre requested for the given ID was not found");

  res.send(genre);
});

// Get request for a genre's ID
router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found");
  res.send(genre);
});

module.exports = router;
