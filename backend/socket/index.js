const io = require("../server").io;

io.on("connect", (socket) => {
  // console.log("a new user is connected....", socket.id);

  socket.on("join-room", ({ room_id, user }) => {
    console.log("joining room", user.name, { room_id });

    socket.join(room_id);
    socket.to(room_id).emit("new-user-join", user);
  });

  socket.on("send-message", ({ msg }) => {
    console.log("SEND MESSAGE");
    socket.to(msg.room_id).emit("new-message", msg);
  });

  socket.on("leave-room", (room) => {
    console.log("leave the room", room);
    socket.leave(room);
  });

  socket.on("disconnect", (socket) => {
    console.log("A user is disconnected", socket.id);
  });
});

module.exports = io;
