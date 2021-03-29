// all express related stuff;
const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = require("../server").app;
const { apiVersion, swaggerOptions } = require("../constants/constants");

// api-routes
const { userRoutes, teamRoutes, challengeRoutes } = require("../routes/routes");

app.get("/", (req, res) => {
  res.send(`<h1>Will render the admin panel for the app...!</h1>`);
});

app.use(cors());
app.use(express.json());
// all the api-end-points
app.use(apiVersion, userRoutes);
app.use(apiVersion, teamRoutes);
app.use(apiVersion, challengeRoutes);

// generate the swagger api documentations
const specs = swaggerJsdoc(swaggerOptions);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

module.exports = app;
