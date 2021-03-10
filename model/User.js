const mongoose = require("mongoose");

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

  userObject.id = user._id;
  delete userObject.token;
  delete userObject.password;
  delete userObject._id;

  return userObject;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
