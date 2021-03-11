const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
    token: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.token;
  delete userObject.password;
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

    user.token = token;
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

const User = mongoose.model("User", userSchema);

module.exports = User;
