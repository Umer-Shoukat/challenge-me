const ChatRoom = require("../model/ChatRoom");
const { handleErrors } = require("../helpers/helpers");

module.exports = {
  async getSingleChatroom(req, res) {
    try {
      const room = await ChatRoom.findOne({
        room_id: req.params.id,
        members: req.user._id,
      })
        .populate("members")
        .populate("team");
      if (!room) throw new Error("No room found!!!");
      res.status(200).send({ room });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  async getChatRooms(req, res) {
    try {
      const rooms = await ChatRoom.find({ members: req.user._id })
        .populate("members")
        .populate("team");

      res.status(200).send({ rooms });
    } catch (error) {
      handleErrors(res, error);
    }
  },
};
