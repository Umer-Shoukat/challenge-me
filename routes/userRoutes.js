const express = require("express");
const router = new express.Router();

// middleware
const authMiddleWare = require("../middleware/auth");

// controller
const {
  login,
  register,
  updateMe,
  deleteMe,
  getAllUsers,
  getUserDetail,
  getMe,
} = require("../controller/userController");

// public routes
/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Users
 *     name: Login
 *     summary: Logged the user in
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.post("/login", login);
/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Users
 *     name: Register
 *     summary: register new user
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.post("/register", register);

// -----------------------------------------------
// --------------Requires AUTH-------------------
// ----------------------------------------------
/**
 * @swagger
 * /me:
 *   get:
 *     tags:
 *       - Users
 *     name: Profile Detail
 *     summary: get profile details
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.get("/me", authMiddleWare, getMe);
/**
 * @swagger
 * /user/:id:
 *   get:
 *     tags:
 *       - Users
 *     name: User Details
 *     summary: get specific user details
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.get("/user/:id", authMiddleWare, getUserDetail);
/**
 * @swagger
 * /user:
 *   patch:
 *     tags:
 *       - Users
 *     name: Update Profile
 *     summary: Update user profile
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.patch("/user", authMiddleWare, updateMe);
/**
 * @swagger
 * /delete:
 *   delete:
 *     tags:
 *       - Users
 *     name: Delete user
 *     summary: delete the user account
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.delete("/user", authMiddleWare, deleteMe);
/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     name: List of Users
 *     summary: Get the list of users
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.get("/users", authMiddleWare, getAllUsers);

module.exports = router;
