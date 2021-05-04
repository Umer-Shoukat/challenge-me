const io = require("../server").io;

// modals
const Message = require("../model/Message");
const ChatRoom = require("../model/ChatRoom");
const User = require("../model/User");

io.on("connect", (socket) => {
  socket.on("user-logged-in", async ({ _id }) => {
    try {
      const user = await User.findById(_id);
      if (!user) throw new Error("User not found");
      user.active = true;
      await user.save();
      socket.user = user;
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("join-room", ({ room_id, user }) => {
    socket.join(room_id);
    socket.broadcast.to(room_id).emit("new-user-join", user);
  });

  socket.on("send-message", async ({ msg }) => {
    delete msg._id;
    const message = await new Message(msg);
    await message.save();

    const room = await ChatRoom.findOne({ room_id: msg.room_id });
    if (!room) {
      socket.broadcast.to(msg.room_id).emit("error", "No room found");
      return;
    }

    room.last_msg = message._id;
    await room.save();
    socket.broadcast.to(msg.room_id).emit("new-message", message);
  });

  socket.on("leave-room", (room) => {
    socket.leave(room);
  });

  socket.on("disconnect", async () => {
    console.log("A user is disconnected ==>", socket.user._id);
    try {
      const { _id } = socket.user;
      const user = await User.findById(_id);
      user.active = false;
      user.last_active = new Date();
      await user.save();
    } catch (err) {
      console.log(err);
    }
  });
});

module.exports = io;
