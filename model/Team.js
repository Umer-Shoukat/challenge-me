const mongoose = require("mongoose");

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
    leader_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    co_leaders: [
      {
        type: mongoose.Types.ObjectId,
      },
    ],
    request_list: [
      {
        type: mongoose.Types.ObjectId,
      },
    ],
    players_list: [
      {
        type: mongoose.Types.ObjectId,
      },
    ],
    images: {
      image: {
        type: String,
        default: "",
      },
      backgroundImage: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

teamSchema.methods.isLeader = function ({ _id }) {
  const team = this.toObject();
  if (team.leader_id.toString() !== _id.toString()) return false;
  return true;
};

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
