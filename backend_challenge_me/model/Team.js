const mongoose = require("mongoose");
const User = require("./User");

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
        user_id: {
          type: mongoose.Types.ObjectId,
        },
        made_by: {
          type: mongoose.Types.ObjectId,
        },
        created_at: {
          type: Date,
          default: new Date(),
        },
      },
    ],
    request_list: [
      {
        user_id: {
          type: mongoose.Types.ObjectId,
        },
        request_at: {
          type: Date,
          default: new Date(),
        },
      },
    ],
    players_list: [
      {
        user_id: {
          type: mongoose.Types.ObjectId,
        },
        joined_at: {
          type: Date,
          default: new Date(),
        },
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
  if (team.leader_id.toString() !== _id.toString()) return false;
  return true;
};

teamSchema.methods.hasRightToChange = function (user, ruleType) {
  const team = this.toObject();
  const user_id = user._id.toString();

  const rules = team.rules;

  // checking if the user is admin
  if (team.leader_id.toString() === user_id) return user_id;

  // else checking if the user is in the co_leader and has right to change something...
  let isCoLeader = team.co_leaders.find(
    (player) => player.user_id.toString() === user_id
  );
  if (!isCoLeader) return false;
  if (!rules[ruleType]) return false;

  // only if the user in co_leader list and has right to change
  return user_id;
};

teamSchema.methods.mapTeamDetails = async function () {
  const team = this.toObject();
  const { co_leaders, request_list, players_list, leader_id } = team;
  const leader = await User.findById(leader_id);
  const coLeaders = await getUserDetails(co_leaders);
  const requestLists = await getUserDetails(request_list);
  const playersLists = await getUserDetails(players_list);
  return {
    ...team,
    leader,
    coLeaders,
    requestLists,
    playersLists,
  };
};

// helper function
async function getUserDetails(ids) {
  const users = await User.find({
    _id: {
      $in: ids.map((user) => mongoose.Types.ObjectId(user.user_id)),
    },
  });

  return users;
}

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
