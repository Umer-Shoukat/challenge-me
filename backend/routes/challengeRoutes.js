const express = require("express");
const authMiddleware = require("../middleware/auth");
const router = new express.Router();

const {
  createChallenge,
  getSingleChallenge,
  getChallengesList,
  updateChallenge,
  deleteChallenge,
  requestChallenge,
  acceptChallenge,
  rejectChallenge,
  removeChallenger,
  addChallengeRules,
  getMyChallenges,
} = require("../controller/challengeController");

/**
 * @swagger
 * /challenge/:id:
 *   get:
 *     tags:
 *       - Challenge
 *     name: Challenge Detail
 *     summary: Get Single Challenge Detail
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.get("/challenge/:id", getSingleChallenge);

/**
 * @swagger
 * /challenges:
 *   get:
 *     tags:
 *       - Challenge
 *     name: Challenges List
 *     summary: List of all the challenges
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.get("/challenges", getChallengesList);

/**
 * @swagger
 * /challenge:
 *   post:
 *     tags:
 *       - Challenge
 *     name: Create Challenge
 *     summary: Create a new Challenge
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.post("/challenge", authMiddleware, createChallenge);

/**
 * @swagger
 * /challenge:
 *   patch:
 *     tags:
 *       - Challenge
 *     name: Update Challenge
 *     summary: Update the challenge
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.patch("/challenge", authMiddleware, updateChallenge);

/**
 * @swagger
 * /challenge:
 *   delete:
 *     tags:
 *       - Challenge
 *     name: Delete Challenge
 *     summary: Delete the Challenge
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.delete("/challenge", authMiddleware, deleteChallenge);

/**
 * @swagger
 * /challenge/add-rules:
 *   post:
 *     tags:
 *       - Challenge
 *     name: Add/Update rules
 *     summary: Add/Update challenge rules
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.post("/challenge/add-rules", authMiddleware, addChallengeRules);

/**
 * @swagger
 * /challenge/request-challenge:
 *   post:
 *     tags:
 *       - Challenge
 *     name: Request a challenge
 *     summary: Request a challenge
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.post("/challenge/request-challenge", authMiddleware, requestChallenge);

/**
 * @swagger
 * /challenge/accept-challenge:
 *   post:
 *     tags:
 *       - Challenge
 *     name: Accept Challenge
 *     summary: Accept the challenge
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.post("/challenge/accept-challenge", authMiddleware, acceptChallenge);

/**
 * @swagger
 * /challenge/reject-challenge:
 *   post:
 *     tags:
 *       - Challenge
 *     name: Reject the challenge
 *     summary: Reject the challenger request
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.post("/challenge/reject-challenge", authMiddleware, rejectChallenge);

/**
 * @swagger
 * /challenge/remove-challenger:
 *   post:
 *     tags:
 *       - Challenge
 *     name: Remove Challenger
 *     summary: Remove the challenger from the challenge
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.post("/challenge/remove-challenger", authMiddleware, removeChallenger);

/**
 * @swagger
 * /my-challenges:
 *   get:
 *     tags:
 *       - Challenge
 *     name: Logged in user Challenges
 *     summary: Logged in user Challenges
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.get("/my-challenges", authMiddleware, getMyChallenges);

module.exports = router;
