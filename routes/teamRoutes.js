const express = require("express");

const authMiddleware = require("../middleware/auth");

const router = new express.Router();

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
} = require("../controller/teamController");

router.get("/team/:id", viewTeam);
router.get("/teams", getTeams);

// ---------------------------------------------------
// -----------------Requires Auth --------------------
// ---------------------------------------------------
router.get("/my-teams", authMiddleware, myTeams);
router.post("/team", authMiddleware, createTeam);
router.patch("/team", authMiddleware, updateTeam);
router.delete("/team", authMiddleware, deleteTeam);

router.post("/team-request-to-join", authMiddleware, requestToJoin);

router.post("/team-accept-player", authMiddleware, acceptPlayer);
router.post("/team-reject-player", authMiddleware, rejectPlayer);

router.post("/team-remove-player", authMiddleware, removePlayer);

router.post("/team-make-co-leader", authMiddleware, makeCoLeader);
router.post("/team-remove-co-leader", authMiddleware, removeCoLeader);

router.post("/team-leave", authMiddleware, leaveTeam);

module.exports = router;
