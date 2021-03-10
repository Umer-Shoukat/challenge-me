const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../model/User");

const login = (req, res) => {
  res.send("Hello message from controller...!!!");
};

const register = async (req, res) => {
  try {
    const user = new User(req.body);

    const encryptedPassword = await bcrypt.hash(req.body.password, 8);
    user.password = encryptedPassword;

    const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.JWT_SECRET
    );

    user.token = token;

    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
  }
};

module.exports = { login, register };
