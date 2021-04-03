const Team = require("../model/Team");
const { handleErrors } = require("../helpers/helpers");

module.exports = {
  // ------------------------------------
  // ---------CREATE NEW TEAM------------
  // ------------------------------------
  async createTeam(req, res) {
    try {
      const leader_id = req.user._id.toString();
      const team = new Team({
        ...req.body,
        leader_id,
      });
      await team.save();
      res.status(201).send({ team });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // ------------------------------------
  // ---------VIEW TEAM DETAIL------------
  // ------------------------------------
  async viewTeam(req, res) {
    try {
      let team = await Team.findById(req.params.id);
      if (!team) throw new Error("No Team Found");

      team = await team.mapTeamDetails();

      res.status(200).send({ team });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // ------------------------------------
  // ---------DELETE TEAM------------
  // ------------------------------------
  async deleteTeam(req, res) {
    try {
      const team = await Team.findById(req.body.id);
      if (!team) throw new Error("No Team found");
      if (!team.isLeader(req.user)) {
        return res
          .status(400)
          .send({ error: "You are not authorize to delete team..!" });
      }
      await team.remove();
      res.status(200).send({ team });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // ------------------------------------
  // ---------UPDATE TEAM------------
  // ------------------------------------
  async updateTeam(req, res) {
    try {
      const id = req.body.id;
      delete req.body.id;
      const updates = Object.keys(req.body);
      const fieldsCanUpdate = [
        "name",
        "description",
        "isPrivate",
        "players_limit",
      ];
      const validInput = updates.every((update) =>
        fieldsCanUpdate.includes(update)
      );
      if (!validInput) {
        return res.status(400).send({ error: "Invalid updates!" });
      }
      const team = await Team.findById(id);
      if (!team) throw new Error("No Team Found");

      if (!team.hasRightToChange(req.user, "co_leader_update_team")) {
        return res
          .status(400)
          .send({ error: "You are not authorize to update team..!" });
      }
      updates.forEach((update) => (team[update] = req.body[update]));
      await team.save();
      res.status(201).send({ team });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // ------------------------------------
  // ---------GET LIS OF THE TEAMS------------
  // ------------------------------------
  async getTeams(req, res) {
    try {
      const sort = {};
      const { page = 1, limit = 2, sortBy } = req.query;
      if (sortBy) {
        const parts = sortBy.split(":");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
      }
      const count = await Team.countDocuments();
      const teams = await Team.find()
        .limit(parseInt(limit) * 1)
        .skip((parseInt(page) - 1) * parseInt(limit))
        .sort(sort)
        .exec();

      res.status(200).send({
        teams,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalDocuments: count,
      });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // ------------------------------------
  // ---------REQUEST TO JOIN TEAM------------
  // ------------------------------------
  async requestToJoin(req, res) {
    try {
      const user_id = req.user._id.toString();

      const team = await Team.findById(req.body.id);
      if (!team) throw new Error("No team Found");

      // first check if the team limit is full
      const totalPlayers = team.players_list.length;
      if (totalPlayers >= team.players_limit)
        throw new Error("Cannot Join Players Limit reach to maximum limit");
      // check if the user already exist in the team
      const exist = team.players_list.find(
        (player) => player.user_id.toString() === user_id
      );
      if (exist) throw new Error("You have already in the team");
      //
      if (team.leader_id.toString() === user_id)
        throw new Error("You are the leader of the team");
      //
      const alreadyRequested = team.request_list.find(
        (player) => player.user_id.toString() === user_id
      );
      if (alreadyRequested)
        throw new Error("You are already requested to join the team");

      if (team.isPrivate)
        team.request_list.push({
          user_id,
        });
      else
        team.players_list.push({
          user_id,
        });

      await team.save();
      res.status(201).send({ team });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // ------------------------------------
  // ---------ACCEPT PLAYER REQUEST------------
  // ------------------------------------
  async acceptPlayer(req, res) {
    try {
      const { team_id, user_id } = req.body;
      if (!user_id || !team_id) throw new Error("Payload is not valid.");

      const user__id = user_id.toString();
      const team = await Team.findById(team_id);
      if (!team) throw new Error("No team Found");

      // return team;
      const authenticUserId = team.hasRightToChange(
        req.user,
        "co_leader_accept_request"
      );
      if (!authenticUserId) {
        return res
          .status(400)
          .send({ error: "You are not authorize to update team..!" });
      }
      // checking if the user already in the
      const exist = team.players_list.find(
        (player) => player.user_id.toString() === user__id
      );
      if (exist) throw new Error("User is already in the Team...");

      // check if there is limit for the team players to add
      const totalPlayers = team.players_list.length;
      if (totalPlayers >= team.players_limit)
        throw new Error(
          "Cannot Accept player bcz maximum players added in the list"
        );

      // removing the user from request list
      const index = team.request_list.findIndex(
        (player) => player.user_id.toString() === user__id
      );
      if (index === -1) throw new Error("Don't have such request...");
      team.request_list.splice(index, 1);

      // adding the player to the list
      team.players_list.push({
        user_id: user__id,
      });

      await team.save();

      res.status(201).send({ team });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // ------------------------------------
  // ---------REJECT PLAYER REQUEST------------
  // ------------------------------------
  async rejectPlayer(req, res) {
    try {
      const { team_id, user_id } = req.body;
      if (!user_id || !team_id) throw new Error("Payload is not valid.");

      const team = await Team.findById(team_id);
      if (!team) throw new Error("Team not found");

      // if (!team.isLeader(req.user))
      //   throw new Error("You are not authorized to reject the user");

      const authenticUserId = team.hasRightToChange(
        req.user,
        "co_leader_reject_request"
      );
      if (!authenticUserId)
        throw new Error("You are not authorize to update team..!");

      const exist = team.request_list.find(
        (player) => player.user_id.toString() === user_id.toString()
      );
      if (!exist) throw new Error("User not found.");

      team.request_list = team.request_list.filter(
        (player) => player.user_id.toString() !== user_id.toString()
      );

      await team.save();

      res.status(201).send({ team });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // ------------------------------------
  // ---------REMOVE PLAYER FROM TEAM------------
  // ------------------------------------
  async removePlayer(req, res) {
    try {
      const { user_id, team_id } = req.body;
      if (!user_id || !team_id) throw new Error("Payload is not valid.");

      const team = await Team.findById(team_id);
      if (!team) throw new Error("No team found");

      // if (!team.isLeader(req.user))
      //   throw new Error("You are not authorized to reject player");

      const authenticUserId = team.hasRightToChange(
        req.user,
        "co_leader_remove_player"
      );
      if (!authenticUserId)
        throw new Error("You are not authorize to update team..!");

      const exist = team.players_list.find(
        (player) => player.user_id.toString() === user_id.toString()
      );
      if (!exist) throw new Error("No player found");

      team.players_list = team.players_list.filter(
        (player) => player.user_id.toString() !== user_id.toString()
      );
      // removing the player even if he is the co leader
      team.co_leaders = team.co_leaders.filter(
        (player) => player.user_id.toString() !== user_id.toString()
      );

      await team.save();
      res.status(201).send({ team });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // ------------------------------------
  // ---------MAKE PLAYER TO CO-LEADER------------
  // ------------------------------------
  async makeCoLeader(req, res) {
    try {
      const { user_id, team_id } = req.body;
      if (!user_id || !team_id) throw new Error("Payload is not valid.");

      const team = await Team.findById(team_id);
      if (!team) throw new Error("No team Found");

      // if (!team.isLeader(req.user))
      //   throw new Error("You are not Authorized to perform sun action.");

      const authenticUserId = team.hasRightToChange(
        req.user,
        "co_leader_make_co_leader"
      );
      if (!authenticUserId)
        throw new Error("You are not authorize to update team..!");

      const exist = team.players_list.find(
        (player) => player.user_id.toString() === user_id.toString()
      );
      if (!exist) throw new Error("No player found.");

      const alreadyLeader = team.co_leaders.find(
        (player) => player.user_id.toString() === user_id.toString()
      );
      if (alreadyLeader) throw new Error("Player is already a leader");

      // checking the limit for max number of co_leaders
      const max_numbers = team.rules.max_co_leader;
      if (team.co_leaders.length >= max_numbers)
        throw new Error("Max Number of co leaders limit exceeds");

      team.co_leaders.push({
        user_id,
        made_by: authenticUserId,
      });

      await team.save();

      res.status(201).send({ team });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // ------------------------------------
  // ---------REMOVE FROM PLAYER FROM LEADERSHIP------------
  // ------------------------------------
  async removeCoLeader(req, res) {
    try {
      const { user_id, team_id } = req.body;
      if (!user_id || !team_id) throw new Error("Payload is not valid.");

      const team = await Team.findById(team_id);
      if (!team) throw new Error("No Team found");

      // if (!team.isLeader(req.user))
      //   throw new Error("You are not Authorized to perform sun action.");

      const authenticUserId = team.hasRightToChange(
        req.user,
        "co_leader_make_co_leader"
      );
      if (!authenticUserId)
        throw new Error("You are not authorize to update team..!");

      const exist = team.co_leaders.find(
        (player) => player.user_id.toString() === user_id.toString()
      );
      if (!exist) throw new Error("Player Is not a leader");

      team.co_leaders = team.co_leaders.filter(
        (player) => player.user_id.toString() !== user_id.toString()
      );

      await team.save();

      res.status(201).send({ team });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // ------------------------------------
  // ---------LEAVE TEAM------------
  // ------------------------------------
  async leaveTeam(req, res) {
    try {
      const { team_id } = req.body;
      if (!team_id) throw new Error("Payload is not valid.");
      const user_id = req.user._id.toString();

      const team = await Team.findById(team_id);
      if (!team) throw new Error("No Team found");

      if (user_id === team.leader_id.toString())
        throw new Error("Leader cannot leave the team...");

      const exist = team.players_list.find(
        (player) => player.user_id.toString() === user_id
      );
      if (!exist) throw new Error("Player not Found");

      team.players_list = team.players_list.filter(
        (player) => player.user_id.toString() !== user_id
      );
      // removing if the user is co loader also;
      team.co_leaders = team.co_leaders.filter(
        (player) => player.user_id.toString() !== user_id
      );

      await team.save();

      res.status(201).send({ team });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // ------------------------------------
  // ---------GET TEAMS USER JOINED------------
  // ------------------------------------
  async myTeams(req, res) {
    try {
      const teams = await Team.find({ leader_id: req.user._id });
      res.status(200).send({ teams });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // ------------------------------------
  // ---------UPDATE TEAM RULES------------
  // ------------------------------------
  async updateTeamRules(req, res) {
    try {
      const valuesCanUpdate = [
        "co_leader_accept_request",
        "co_leader_reject_request",
        "co_leader_make_co_leader",
        "co_leader_remove_co_leader",
        "co_leader_remove_player",
        "co_leader_update_team",
        "max_co_leader",
      ];
      const team_id = req.body.team_id;
      delete req.body.team_id;
      const updates = Object.keys(req.body);

      const validInputs = updates.every((update) =>
        valuesCanUpdate.includes(update)
      );

      if (!validInputs) throw new Error("Invalid Inputs");

      const team = await Team.findById(team_id);
      if (!team) throw new Error("No TEam Found");

      if (!team.isLeader(req.user))
        throw new Error("You are not authorized to perform such action");

      updates.forEach((update) => {
        team.rules[update] = req.body[update];
      });

      await team.save();

      res.status(201).send({ team });
    } catch (error) {
      handleErrors(res, error);
    }
  },
};
