const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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
    creator: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    creator_team: {
      type: mongoose.Types.ObjectId,
      ref: "Team",
    },
    challenger: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    challenger_team: {
      type: mongoose.Types.ObjectId,
      ref: "Team",
    },
    user_requests: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    team_requests: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Team",
      },
    ],
    open_players_list: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
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

challengeSchema.methods.isCreator = function ({ _id }) {
  const challenge = this.toObject();
  if (challenge.creator._id.toString() !== _id.toString())
    throw new Error("You are not authorized to perform such action");
  return true;
};

challengeSchema.methods.hasRequested = function (user_id) {
  const challenge = this.toObject();

  const exist = challenge.challenge_requests.find(
    (challenger) => challenger.challenger._id.toString() === user_id.toString()
  );

  if (exist) throw new Error("You has already requested  for the challenge");

  return true;
};

challengeSchema.plugin(mongoosePaginate);
challengeSchema.index({ name: "text", description: "text" });

const Challenge = mongoose.model("Challenge", challengeSchema);

module.exports = Challenge;
