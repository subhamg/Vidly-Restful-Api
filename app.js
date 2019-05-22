const Joi = require("@hapi/joi");
const express = require("express");
const genres = require("./routes/genres");
const app = express();

app.use(express.json());
app.use("/api/genres", genres);

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening to port ${port}...`);
});
