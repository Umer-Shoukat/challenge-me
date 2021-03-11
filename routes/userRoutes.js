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
} = require("../controller/userController");

// public routes
router.post("/login", login);
router.post("/register", register);

// authenticated routes
router.get("/me", authMiddleWare, getUserDetail);
router.patch("/user", authMiddleWare, updateMe);
router.delete("/user", authMiddleWare, deleteMe);
router.get("/users", authMiddleWare, getAllUsers);

module.exports = router;
