require("dotenv").config();
require("./mongoose/mongoose");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
// swagger
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const Websocket = require("./socket/socket");
const { apiVersion, swaggerOptions } = require("./constants/constants");

// password-js
require("./config/passport")(passport);

// api-routes
const {
  userRoutes,
  teamRoutes,
  challengeRoutes,
  seedRoutes,
  chatRoomRoutes,
} = require("./routes/routes");

const app = express();
const port = process.env.PORT || 3000;

app.set(port);
app.use(cors());
app.use(logger("dev"));
app.use(express.json());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: process.env.DATABASE_CONNECTION,
    }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.get("/", (req, res) => {
  res.send(`<h1>Will render the admin panel for the app...!</h1>`);
});
// all the rest api-end-points
app.use(apiVersion, userRoutes);
app.use(apiVersion, teamRoutes);
app.use(apiVersion, challengeRoutes);
app.use(apiVersion, seedRoutes);
app.use(apiVersion, chatRoomRoutes);

// generate the swagger api documentations
const specs = swaggerJsdoc(swaggerOptions);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

/** catch 404 and forward to error handler */
app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API endpoint doesnt exist",
  });
});

const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: ["http://localhost:8080", "*"],
    // methods: ["GET", "POST"],
    // credentials: false,
    handlePreflightRequest: (req, res) => {
      res.writeHead(200, {
        "Access-Control-Allow-Origin": "http://localhost:8080",
        "Access-Control-Allow-Methods": "GET,POST",
        "Access-Control-Allow-Credentials": true,
      });
      res.end();
    },
  },
});

global.io = io;
global.io.on("connection", Websocket.connection);

server.listen(port, () => {
  console.log(`SERVER running on port: ${port}`);
});
