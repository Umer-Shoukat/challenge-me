const ChatRoom = require("../model/ChatRoom");
const Message = require("../model/Message");
const User = require("../model/User");

// helpers
const { handleErrors } = require("../helpers/helpers");

module.exports = {
  async getSingleChatroom(req, res) {
    try {
      const room = await ChatRoom.findOne({
        room_id: req.params.id,
        members: req.user._id,
      })
        .populate("members")
        .populate("team")
        .populate("last_msg");
      if (!room) throw new Error("No room found!!!");

      const messages = await Message.find({ room_id: req.params.id });

      res.status(200).send({ room, messages });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  async getChatRooms(req, res) {
    try {
      const rooms = await ChatRoom.find({ members: req.user._id })
        .populate("members")
        .populate("team")
        .populate("last_msg");

      res.status(200).send({ rooms });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  async checkRoom(req, res) {
    try {
      const { user_id_1, user_id_2 } = req.body;

      // create the room id
      let room_id = `${user_id_1.toString()}-${user_id_2.toString()}`;
      if (user_id_2.toString() > user_id_1.toString()) {
        room_id = `${user_id_2.toString()}-${user_id_1.toString()}`;
      }

      const roomExist = await ChatRoom.findOne({ room_id });
      // if room available
      if (roomExist) return res.status(200).send({ room: roomExist });

      // if room not available
      const user1 = await User.findById(user_id_1);
      const user2 = await User.findById(user_id_2);

      // if there is no user
      if (!user1 || !user2) {
        throw new Error("User not Found");
      }

      const room = new ChatRoom({
        room_id,
        room_type: "chat",
        members: [user1._id.toString(), user2._id.toString()],
      });

      await room.save();

      res.status(201).send({ room });
    } catch (error) {
      handleErrors(res, error);
    }
  },
};
