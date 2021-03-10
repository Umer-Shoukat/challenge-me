// all express related stuff;
const express = require("express");
const app = require("../server").app;

const userRoutes = require("../routes/userRoutes");

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use(express.json());

// all the api-end-points
const apiPreFix = "/api/v1";
app.use(apiPreFix, userRoutes);

module.exports = app;
