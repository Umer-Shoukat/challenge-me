const io = require("../server").io;

io.sockets.on("connect", () => {
  console.log("a user is connected....");
});

module.exports = io;
