require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/restful-auth-api");

const express = require("express");
const app = express();
const port = process.env.PORT | 8000;

const userRoute = require("./routes/userRoute");
app.use("/api", userRoute);

app.listen(port, function () {
  console.log("Server listening on " + port);
});
