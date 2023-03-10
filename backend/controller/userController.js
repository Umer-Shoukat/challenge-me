const jwt = require("jsonwebtoken");
const User = require("../model/User");
const transporter = require("../mail/mail");
const { handleErrors } = require("../helpers/helpers");
const s3sUpload = require("../helpers/s3Upload");
// const { bucket } = require("../firebase/firebase-admin");

module.exports = {
  // ------------------------------------------
  // --------REGISTER A NEW USER----------------
  // -----------------------------------------
  async register(req, res) {
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
  },
  // ------------------------------------------
  // --------LOGGED USER IN----------------
  // -----------------------------------------
  async login(req, res) {
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
  },
  // -------------------------------------------------
  // --------GET LOGGED IN USER DETAILS----------------
  // --------------------------------------------------
  async getMe(req, res) {
    console.log(req);

    try {
      res.send({
        user: "hello",
      });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // ----------------------------------------
  // --------GET USER DETAILS----------------
  // ----------------------------------------
  async getUserDetail(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id).populate("teams");
      if (!user) throw new Error("User not found");

      res.send({ user, teams: user.teams });
    } catch (error) {
      console.log(error);
      handleErrors(res, error);
    }
  },
  // --------------------------------------------------
  // --------UPDATE LOGGED IN USER---------------------
  // --------------------------------------------------
  async updateMe(req, res) {
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
        user.tokens = [];
        let token = await user.generateAuthToken();
        await user.save();
        // generating the new token
        res.status(200).send({ user, token });
        return;
      }
      res.status(200).send({ user });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // ------------------------------------
  // --------DELETE USER-----------------
  // ------------------------------------
  async deleteMe(req, res) {
    try {
      await req.user.remove();
      res.status(200).send({ user: req.user });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // -------------------------------------------------
  // --------GET ALL USERS FOR ADMIN  ----------------
  // --------------------------------------------------
  async getAllUsers(req, res) {
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
  },
  // -------------------------------------------------
  // --------LOGGED OUT FROM ONE DEVICE----------------
  // --------------------------------------------------
  async logout(req, res) {
    console.log(req.isAuthenticated(), req.user);
    try {
      if ("logout" in req) {
        req.logout();
        res.status(201).send({ msg: "User logged out successfully" });
        return;
      }

      const { token, user } = req;
      user.tokens = user.tokens.filter((t) => t.token !== token);
      await user.save();
      res.status(201).send({ msg: "User logged out successfully" });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // -------------------------------------------------
  // --------LOGGED OUT FROM ALL DEVICES----------------
  // --------------------------------------------------
  async logoutAll(req, res) {
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
  },
  // ------------------------------------------------------------
  // --------SEND OTP TO USER FOR FORGOT PASSWORD----------------
  // ------------------------------------------------------------
  async sendOtp(req, res) {
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
            msg: "Otp send to your email account please check to verify",
          });
        }
      });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // --------------------------------------
  // --------VERIFY THE OTP----------------
  // --------------------------------------
  async verifyOtp(req, res) {
    try {
      const { email, otp_code } = req.body;
      const user = await User.findOne({ email });
      if (!user) throw new Error("No User Found");
      if (user.otp_code == 0)
        throw new Error("Otp not send play recheck again.");
      if (otp_code !== user.otp_code) throw new Error("OTP not matched");
      user.otp_code = "0";

      const token = jwt.sign({ email }, process.env.JWT_SECRET);

      await user.save();

      res.status(200).send({ otp_verified: true, token });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // ------------------------------------------
  // --------RESET THE PASSWORD----------------
  // ------------------------------------------
  async resetPassword(req, res) {
    try {
      const { password, token } = req.body;
      if (!token) throw new Error("invalid token");
      if (!password) throw new Error("Password not provided");
      const { email } = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found..!");
      user.password = password;
      user.tokens = [];
      await user.save();
      res.status(201).send({ msg: "Password rest successfully. Please login" });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // ------------------------------------------
  // --------UPLOAD AVATAR----------------
  // ------------------------------------------
  async uploadAvatar(req, res) {
    try {
      const file = req.locals.files.avatar[0];
      const name = req.user.name.replace(" ", "-");
      const filePath = `profile/${name}`;
      const link = await s3sUpload(file, filePath);
      const user = req.user;
      user.avatar = link;
      await user.save();
      res.send({
        user,
      });
    } catch (error) {
      handleErrors(res, error);
    }
  },
};
