const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  from: {
    type: mongoose.Types.ObjectId,
  },
  to: {
    type: String,
  },
  room_id: {
    type: String,
  },
  message: {
    type: String,
    default: "",
    trim: true,
  },
  time: {
    type: Date,
    default: new Date(),
  },
  media: [
    {
      type: String,
    },
  ],
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
