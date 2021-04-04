const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const User = require("./User");
const Team = require("./Team");

const challengeSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ["solo", "team", "open"],
      required: true,
    },
    is_private: {
      type: Boolean,
      required: true,
    },
    is_physical: {
      type: Boolean,
      required: true,
    },
    start_time: {
      type: Date,
      required: true,
    },
    end_time: {
      type: Date,
      required: true,
    },
    creator_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    creator_team_id: {
      type: mongoose.Types.ObjectId,
    },
    result_status: {
      type: String,
      enum: ["pending", "won", "lost", "drawn", "no-result"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["scheduled", "active", "finished"],
      default: "scheduled",
    },
    challenger_id: {
      type: mongoose.Types.ObjectId,
    },
    challenger_team_id: {
      type: mongoose.Types.ObjectId,
    },
    tags: [
      {
        type: String,
        required: true,
      },
    ],
    location: {
      address: {
        type: String,
        default: "",
      },
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
    challenge_requests: [
      {
        challenger_id: {
          type: mongoose.Types.ObjectId,
        },
        challenger_team_id: {
          type: mongoose.Types.ObjectId,
        },
      },
    ],
    open_players_list: [
      {
        user_id: {
          type: mongoose.Types.ObjectId,
        },
      },
    ],
    rules: {
      max_team_players: { type: Number, default: 8 },
      min_team_players: { type: Number, default: 1 },
      max_age: { type: Number },
      min_age: { type: Number },
      max_number_players: { type: Number, default: 8 },
    },
  },
  {
    timestamps: true,
  }
);

challengeSchema.statics.mapChallenges = async function (challenges) {
  try {
  } catch (err) {
    throw new Error(err);
  }
};

challengeSchema.methods.mapChallenge = async function () {
  const challenge = this.toObject();
  const { creator_id, challenge_requests, open_players_list, type } = challenge;

  const creator = await User.findById(creator_id);
  const open_players = await getUserDetails(
    User,
    open_players_list.map((request) => request.user_id)
  );
  const request_list = await getUserDetails(
    type === "team" ? Team : User,
    challenge_requests.map((request) => {
      if (type === "team") return request.challenger_team_id;
      return request.challenger_id;
    })
  );

  challenge.creator = creator;
  challenge.open_players = open_players;
  challenge.request_list = request_list;

  delete challenge.challenge_requests;
  delete challenge.open_players_list;

  return challenge;
};

async function getUserDetails(Modal, ids) {
  const modal = await Modal.find({
    _id: {
      $in: ids.map((id) => mongoose.Types.ObjectId(id)),
    },
  });

  return modal;
}

challengeSchema.methods.isCreator = function ({ _id }) {
  const challenge = this.toObject();
  if (challenge.creator_id.toString() !== _id.toString())
    throw new Error("You are not authorized to perform such action");
  return true;
};

challengeSchema.methods.hasRequested = function (user_id) {
  const challenge = this.toObject();

  const exist = challenge.challenge_requests.find(
    (challenger) => challenger.challenger_id.toString() === user_id.toString()
  );

  if (exist) throw new Error("You has already requested  for the challenge");

  return true;
};

challengeSchema.plugin(mongoosePaginate);
challengeSchema.index({ name: "text", description: "text" });

const Challenge = mongoose.model("Challenge", challengeSchema);

module.exports = Challenge;
