const express = require("express");
const router = new express.Router();

// middleware
const authMiddleWare = require("../middleware/auth");

// controller
const { login, register } = require("../controller/userController");

// api end points
router.get("/login", authMiddleWare, login);

router.post("/register", register);

module.exports = router;
