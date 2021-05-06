const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
    },
    role: {
      type: String,
      default: "user",
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
      default: "",
    },
    dob: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    last_active: {
      type: Date,
    },
    otp_code: {
      type: String,
      default: 0,
    },
    push_notification_id: {
      type: String,
    },
    tokens: [
      {
        token: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.tokens;
  delete userObject.password;
  delete userObject.otp_code;
  delete userObject.push_notification_id;
  return userObject;
};

userSchema.statics.findByCredentials = async function ({ email, password }) {
  const user = await User.findOne({ email });

  if (!user) throw new Error("Unable to find user");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Unable to login");

  return user;
};

userSchema.methods.generateAuthToken = async function () {
  try {
    const user = this;

    const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.JWT_SECRET
    );

    user.tokens.push({ token });
    await user.save();

    return token;
  } catch (err) {
    throw new Error(err);
  }
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password"))
    user.password = await bcrypt.hash(user.password, 8);

  next();
});

userSchema.virtual("teams", {
  ref: "Team",
  localField: "_id",
  foreignField: "leader",
});

const User = mongoose.model("User", userSchema);

module.exports = User;
