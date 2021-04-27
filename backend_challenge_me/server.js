const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

const server = app.listen(port, () =>
  console.log(`App listening on port ${port}`)
);

const io = socketio(server, {
  cors: {
    origin: ["http://localhost:8080", "*"],
    methods: ["GET", "POST"],
    credentials: false,
  },
});

module.exports = {
  app,
  io,
};
