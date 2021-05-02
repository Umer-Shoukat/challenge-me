const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ChatRoom = require("./ChatRoom");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    isPrivate: {
      type: Boolean,
      default: true,
    },
    players_limit: {
      type: Number,
      default: 8,
    },
    leader: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    image_url: {
      type: String,
      default: "",
    },
    background_url: {
      type: String,
      default: "",
    },
    co_leaders: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    request_list: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    players_list: [{ type: mongoose.Types.ObjectId, ref: "User" }],

    rules: {
      co_leader_accept_request: {
        type: Boolean,
        default: false,
      },
      co_leader_reject_request: {
        type: Boolean,
        default: false,
      },
      co_leader_make_co_leader: {
        type: Boolean,
        default: false,
      },
      co_leader_remove_co_leader: {
        type: Boolean,
        default: false,
      },
      co_leader_remove_player: {
        type: Boolean,
        default: false,
      },
      co_leader_update_team: {
        type: Boolean,
        default: false,
      },
      max_co_leader: {
        type: Number,
        default: 0,
        max: 4,
      },
    },
  },
  {
    timestamps: true,
  }
);

teamSchema.methods.isLeader = function ({ _id }) {
  const team = this.toObject();
  if (team.leader._id.toString() !== _id.toString()) return false;
  return true;
};

teamSchema.methods.hasRightToChange = function (user, ruleType) {
  const team = this.toObject();
  const user_id = user._id.toString();

  const rules = team.rules;

  // checking if the user is admin
  if (team.leader._id.toString() === user_id) return user_id;

  // else checking if the user is in the co_leader and has right to change something...
  let isCoLeader = team.co_leaders.find(
    (player) => player._id.toString() === user_id
  );
  if (!isCoLeader) return false;
  if (!rules[ruleType]) return false;

  // only if the user in co_leader list and has right to change
  return user_id;
};

teamSchema.methods.addToRoom = async function (user_id) {
  const { _id } = this.toObject();
  user_id = user_id.toString();

  const room = await ChatRoom.findOne({ room_id: _id });
  if (!room) throw new Error("Room not found...!!!");

  room.members.push(user_id);

  await room.save();
  return true;
};

teamSchema.pre("remove", async function (next) {
  // TODO:: will do some cleanup
  next();
});

teamSchema.plugin(mongoosePaginate);
teamSchema.index({ name: "text", description: "text" });

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
