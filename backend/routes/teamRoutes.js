const express = require("express");
const router = new express.Router();

// middleware
const authMiddleware = require("../middleware/auth");
const getFileMiddleWare = require("../middleware/multiparty");

const {
  createTeam,
  viewTeam,
  deleteTeam,
  updateTeam,
  getTeams,
  requestToJoin,
  acceptPlayer,
  rejectPlayer,
  removePlayer,
  makeCoLeader,
  removeCoLeader,
  leaveTeam,
  myTeams,
  updateTeamRules,
  saveTeamImages,
} = require("../controller/teamController");

/**
 * @swagger
 * /team/:id:
 *   get:
 *     tags:
 *       - Team
 *     name: Team Detail
 *     summary: Get team details
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.get("/team/:id", viewTeam);

/**
 * @swagger
 * /teams:
 *   get:
 *     tags:
 *       - Team
 *     name: Teams list
 *     summary: Get list of the teams
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.get("/teams", getTeams);

// ---------------------------------------------------
// -----------------Requires Auth --------------------
// ---------------------------------------------------

/**
 * @swagger
 * /my-teams:
 *   get:
 *     tags:
 *       - Team
 *     name: User teams
 *     summary: current user's teams
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.get("/my-teams", authMiddleware, myTeams);

/**
 * @swagger
 * /team:
 *   post:
 *     tags:
 *       - Team
 *     name: Create team
 *     summary: Create a new team
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.post("/team", authMiddleware, createTeam);

/**
 * @swagger
 * /team:
 *   patch:
 *     tags:
 *       - Team
 *     name: Update team
 *     summary: Update team details
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.patch("/team", authMiddleware, updateTeam);

/**
 * @swagger
 * /team:
 *   delete:
 *     tags:
 *       - Team
 *     name: Delete team
 *     summary: Delete team details
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.delete("/team", authMiddleware, deleteTeam);

/**
 * @swagger
 * /team-request-to-join:
 *   post:
 *     tags:
 *       - Team
 *     name: Request to join team
 *     summary: Make a request to join team
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.post("/team-request-to-join", authMiddleware, requestToJoin);

/**
 * @swagger
 * /team-accept-player:
 *   post:
 *     tags:
 *       - Team
 *     name: Accept Player
 *     summary: Accept the player request
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.post("/team-accept-player", authMiddleware, acceptPlayer);

/**
 * @swagger
 * /team-reject-player:
 *   post:
 *     tags:
 *       - Team
 *     name: Reject Player request
 *     summary: Reject the player request
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.post("/team-reject-player", authMiddleware, rejectPlayer);

/**
 * @swagger
 * /team-remove-player:
 *   post:
 *     tags:
 *       - Team
 *     name: Remove Player
 *     summary: remove player from the team
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.post("/team-remove-player", authMiddleware, removePlayer);

/**
 * @swagger
 * /team-make-co-leader:
 *   post:
 *     tags:
 *       - Team
 *     name: make co-leader
 *     summary: make the player to co-leader
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.post("/team-make-co-leader", authMiddleware, makeCoLeader);

/**
 * @swagger
 * /team-remove-co-leader:
 *   post:
 *     tags:
 *       - Team
 *     name: remove from co-leader
 *     summary: Remove the player from co-leader
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.post("/team-remove-co-leader", authMiddleware, removeCoLeader);

/**
 * @swagger
 * /team-leave:
 *   post:
 *     tags:
 *       - Team
 *     name: leave team
 *     summary: leave the team
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.post("/team-leave", authMiddleware, leaveTeam);

/**
 * @swagger
 * /team-update-rules:
 *   post:
 *     tags:
 *       - Team
 *     name: Change team rules
 *     summary: Will update the team rules
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.post("/team-update-rules", authMiddleware, updateTeamRules);

/**
 * @swagger
 * /save-team-images:
 *   post:
 *     tags:
 *       - Team
 *     name: save team images
 *     summary: SAve bot team images background and team
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
router.post(
  "/save-team-images",
  authMiddleware,
  getFileMiddleWare,
  saveTeamImages
);

module.exports = router;
