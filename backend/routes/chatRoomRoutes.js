const express = require("express");
const router = new express.Router();

// middleware
const authMiddleWare = require("../middleware/auth");

// controllers
const {
  getSingleChatroom,
  getChatRooms,
  checkRoom,
} = require("../controller/chatRoomController");

/**
 * @swagger
 * /chat-room/:id:
 *   get:
 *     tags:
 *       - ChatRoom
 *     name: ChatRoom
 *     summary: GET single chatroom details
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.get("/chat-room/:id", authMiddleWare, getSingleChatroom);

/**
 * @swagger
 * /chat-rooms:
 *   get:
 *     tags:
 *       - ChatRoom
 *     name: ChatRoom
 *     summary: GET all chatrooms for the logged in user
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.get("/chat-rooms", authMiddleWare, getChatRooms);

/**
 * @swagger
 * /chat-rooms/check-room:
 *   get:
 *     tags:
 *       - ChatRoom
 *     name: Check for the room
 *     summary: GET all chatrooms for the logged in user
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.post("/chat-rooms/check-room", authMiddleWare, checkRoom);

module.exports = router;
