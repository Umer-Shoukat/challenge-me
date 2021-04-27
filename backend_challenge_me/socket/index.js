const io = require("../server").io;

// io.on("connection", (socket) => {
//   console.log("a user is connected....", socket.id);
// });

// io.sockets.on("connection", (socket) => {
//   console.log("a sockets user is connected....", socket.id);
// });

io.on("connect", (socket) => {
  console.log(" connect a user is connected....", socket.id);

  socket.on("disconnect", (socket) => {
    console.log("A user is disconnected", socket.id);
  });
});

module.exports = io;
