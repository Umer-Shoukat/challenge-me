const User = require("../model/User");
const transporter = require("../mail/mail");
const { handleErrors } = require("../helpers/helpers");

const register = async (req, res) => {
  try {
    const user = new User(req.body);
    const token = await user.generateAuthToken();
    await user.save();
    res.status(200).json({
      user,
      token,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials({ email, password });
    const token = await user.generateAuthToken();
    await user.save();
    res.send({
      user,
      token,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

const getMe = async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    handleErrors(res, error);
  }
};

const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    res.send({ user });
  } catch (error) {
    console.log(error);
    handleErrors(res, error);
  }
};

const updateMe = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const fieldsCanUpdate = ["email", "password", "name", "avatar", "dob"];
    const isValidOperation = updates.every((update) =>
      fieldsCanUpdate.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }
    const user = req.user;
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    // if password is changed recreate the token;;
    if (updates.includes("password")) {
      // removing the old token;
      user.tokens = user.tokens.filter((t) => t.token !== req.token);
      await user.save();
      // generating the new token
      let token = await user.generateAuthToken();
      res.status(200).send({ user, token });
      return;
    }
    res.status(200).send(user);
  } catch (error) {
    handleErrors(res, error);
  }
};

const deleteMe = async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).send(req.user);
  } catch (error) {
    handleErrors(res, error);
  }
};

// for admin
const getAllUsers = async (req, res) => {
  try {
    const sort = {};
    const { page = 1, limit = 2, sortBy } = req.query;
    if (sortBy) {
      const parts = sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }
    const count = await User.countDocuments();
    const users = await User.find()
      .limit(parseInt(limit) * 1)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort(sort)
      .exec();

    res.status(200).send({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalDocuments: count,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

const logout = async (req, res) => {
  try {
    const { token, user } = req;
    user.tokens = user.tokens.filter((t) => t.token !== token);
    await user.save();
    res.status(201).send({ msg: "User logged out successfully" });
  } catch (error) {
    handleErrors(res, error);
  }
};

const logoutAll = async (req, res) => {
  try {
    const { user } = req;
    user.tokens = [];
    await user.save();
    res
      .status(201)
      .send({ msg: "User logged out successfully from all devices" });
  } catch (error) {
    handleErrors(res, error);
  }
};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("No User Found");
    let rand = Math.random();
    const otp_code = String(rand).substring(3, 9);
    user.otp_code = otp_code;

    await user.save();

    const mailData = {
      from: process.env.EMAIL_USERNAME, // sender address
      to: email, // list of receivers
      subject: "Otp to reset password",
      text: otp_code,
    };

    transporter.sendMail(mailData, function (err, info) {
      if (err) {
        handleErrors(res, err);
      } else {
        res.status(200).send({
          msg: "Otp send to your email account pleas check to verify",
        });
      }
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp_code } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("No User Found");
    if (user.otp_code == 0) throw new Error("Otp not send play recheck again.");
    if (otp_code !== user.otp_code) throw new Error("OTP not matched");

    user.otp_code = "0";
    await user.save();

    res.status(200).send({ otp_verified: true });
  } catch (error) {
    handleErrors(res, error);
  }
};

module.exports = {
  login,
  register,
  updateMe,
  deleteMe,
  getAllUsers,
  getUserDetail,
  getMe,
  logout,
  logoutAll,
  sendOtp,
  verifyOtp,
};
