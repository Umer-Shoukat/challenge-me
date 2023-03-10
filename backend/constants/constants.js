const apiVersion = "/api/v1";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Challenge me API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
    },
    servers: [
      {
        url: `http://localhost:3000${apiVersion}`,
      },
    ],
  },
  apis: ["./routes/*.js", "./model/*.js"],
};

module.exports = {
  apiVersion,
  swaggerOptions,
};
