const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  room_id: {
    type: String,
    required: true,
    trim: true,
  },

  team: {
    type: mongoose.Types.ObjectId,
    ref: "Team",
  },

  room_type: {
    type: String,
    enum: ["chat", "team_chat", "challenge_chat"],
    required: true,
  },
  members: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

module.exports = ChatRoom;
