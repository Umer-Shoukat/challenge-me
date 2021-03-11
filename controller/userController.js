const User = require("../model/User");

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
    res.status(400).send({ error });
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
    res.status(400).send({ error });
  }
};

const getUserDetail = async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send({ error });
  }
};

const updateMe = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const fieldsCanUpdate = ["email", "password", "name", "avatar"];

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
      let token = await user.generateAuthToken();
      res.status(200).send({ user, token });
      return;
    }

    res.status(200).send(user);
  } catch (error) {
    console.log("Error", error);
    res.status(400).send({ error });
  }
};

const deleteMe = async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).send(req.user);
  } catch (error) {
    res.status(400).send({ error });
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
    res.status(400).send({ error });
  }
};

module.exports = {
  login,
  register,
  updateMe,
  deleteMe,
  getAllUsers,
  getUserDetail,
};
