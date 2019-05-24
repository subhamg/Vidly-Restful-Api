const mongoose = require("mongoose");
const express = require("express");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const app = express();

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Successfully, connected to the database..."))
  .catch(err => console.error("Couldn't connect to the database..", err));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening to port ${port}...`);
});
