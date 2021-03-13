// all express related stuff;
const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = require("../server").app;

const { apiVersion, swaggerOptions } = require("../constants/constants");

// api-routes
const { userRoutes, teamRoutes } = require("../routes/routes");

app.get("/", (req, res) => {
  res.send(`<h1>Will render the admin panel for the app...!</h1>`);
});

app.use(express.json());
// all the api-end-points
app.use(apiVersion, userRoutes);
app.use(apiVersion, teamRoutes);

// generate the swagger api documentations
const specs = swaggerJsdoc(swaggerOptions);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

module.exports = app;
