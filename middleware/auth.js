const jwt = require("jsonwebtoken");
const User = require("../model/User");

const auth = async (req, res, next) => {
  try {
    if (!req.header("Authorization")) throw new Error("Please Authenticate.");

    const token = req.header("Authorization").replace("Bearer ", "");
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id,
      "tokens.token": token,
    });

    if (!user) throw new Error("Please Authenticate.");

    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    res.status(401).send({ error: error.toString() });
  }
};

module.exports = auth;
