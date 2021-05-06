const io = require("../server").io;

// modals
const Message = require("../model/Message");
const ChatRoom = require("../model/ChatRoom");
const User = require("../model/User");

// create push-notification
const sendNotification = require("../firebase/send-notification");

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

  socket.on("update-push-noti-id", async ({ token, user_id }) => {
    console.log(user_id);
    try {
      const user = await User.findById(user_id);
      if (!user) throw new Error("No User found...!");

      if (!user.push_notification_id) {
        user.push_notification_id = token;
        await user.save();
      } else {
        if (user.push_notification_id !== token) {
          user.push_notification_id = token;
          await user.save();
        }
      }
    } catch (err) {
      console.log(err);
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

    const user_id = room.members.filter((u) => u !== message.from)[0];

    const users = await User.find({ _id: user_id });

    const notiTokens = users.map((u) => u.push_notification_id);

    console.log(notiTokens);

    await sendNotification({
      notification: {
        title: "A new Messsage",
        body: message.message,
        click_action: `${process.env.FRONTEND_WEB_APP}/chats/${room.room_id}`,
      },
      registration_ids: notiTokens,
    });
  });

  socket.on("leave-room", (room) => {
    socket.leave(room);
  });

  socket.on("disconnect", async () => {
    console.log("A user is disconnected ==>");
    if (socket.user) {
      try {
        const { _id } = socket.user;
        const user = await User.findById(_id);
        user.active = false;
        user.last_active = new Date();
        await user.save();
      } catch (err) {
        console.log(err);
      }
    }
  });
});

module.exports = io;
