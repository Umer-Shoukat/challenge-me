const express = require("express");
const socketio = require("socket.io");

const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`App listening on ${port}`));
const io = socketio(server);

module.exports = {
  app,
  io,
};
