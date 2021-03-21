const mongoose = require("mongoose");

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
    rules: {
      max_team_players: { type: Number, default: 8 },
      min_team_players: { type: Number, default: 1 },
      max_age: { type: Number },
      min_age: { type: Number },
      max_number_players: { type: Number, default: 8 },
    },
    // todo:: will add the tags array
  },
  {
    timestamps: true,
  }
);

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

const Challenge = mongoose.model("Challenge", challengeSchema);

module.exports = Challenge;
