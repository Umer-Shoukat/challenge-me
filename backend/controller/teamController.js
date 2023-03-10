// modals
const Team = require("../model/Team");
// helpers
const { handleErrors } = require("../helpers/helpers");
const s3Upload = require("../helpers/s3Upload");

// modals
const ChatRoom = require("../model/ChatRoom");

module.exports = {
  // ------------------------------------
  // ---------CREATE NEW TEAM------------
  // ------------------------------------
  async createTeam(req, res) {
    try {
      const leader = req.user._id.toString();
      const team = new Team({
        ...req.body,
        leader,
      });
      await team.save();

      const room = new ChatRoom({
        room_id: team._id,
        room_type: "team_chat",
        team: team._id,
        members: [req.user._id],
      });

      await room.save();

      res.status(201).send({ team });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  async saveTeamImages(req, res) {
    try {
      let imageLink = "";
      let backgroundImageLink = "";

      const { fields, files } = req.locals;
      const team_id = fields.team_id[0];

      const team = await Team.findById(team_id);
      if (!team) throw new Error("No team found...!");

      let teamName = team.name.split(" ").join("-");
      if (files.image) {
        const image = files.image[0];
        const path = `team-profile/${teamName}`;
        imageLink = await s3Upload(image, path);
        team.image_url = imageLink;
      }

      if (files.backgroundImage) {
        const backgroundImage = files.backgroundImage[0];
        const path = `team-background/${teamName}`;
        backgroundImageLink = await s3Upload(backgroundImage, path);

        team.background_url = backgroundImageLink;
      }

      await team.save();

      res.send({
        team,
      });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // ------------------------------------
  // ---------VIEW TEAM DETAIL------------
  // ------------------------------------
  async viewTeam(req, res) {
    try {
      let team = await Team.findById(req.params.id)
        .populate("leader")
        .populate("co_leaders")
        .populate("request_list")
        .populate("players_list");
      if (!team) throw new Error("No Team Found");

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
      const id = req.body._id;
      delete req.body._id;
      const updates = Object.keys(req.body);
      const fieldsCanUpdate = [
        "name",
        "description",
        "isPrivate",
        "players_limit",
        "rules",
      ];
      const validInput = updates.every((update) =>
        fieldsCanUpdate.includes(update)
      );
      if (!validInput) {
        return res.status(400).send({ error: "Invalid updates!" });
      }
      const team = await Team.findById(id)
        .populate("leader")
        .populate("co_leaders")
        .populate("request_list")
        .populate("players_list");
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
      console.log(error);
      handleErrors(res, error);
    }
  },
  // ------------------------------------
  // ---------GET LIS OF THE TEAMS------------
  // ------------------------------------
  async getTeams(req, res) {
    try {
      const sort = {
        createdAt: -1,
      };
      const { page = 1, limit = 10, sortBy, query = "" } = req.query;
      if (sortBy) {
        const sortKeys = sortBy.split(",");
        sortKeys.forEach((keys) => {
          let parts = keys.split(":");
          sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
        });
      }

      const teams = await Team.paginate(
        {
          $or: [
            { name: new RegExp(query, "gi") },
            { description: new RegExp(query, "gi") },
          ],
        },
        {
          page,
          limit,
          sort,
          customLabels: {
            docs: "teams",
          },
        }
      );

      res.status(200).send(teams);
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

      const team = await Team.findById(req.body.team_id)
        .populate("leader")
        .populate("co_leaders")
        .populate("request_list")
        .populate("players_list");
      if (!team) throw new Error("No team Found");

      // first check if the team limit is full
      const totalPlayers = team.players_list.length;
      if (totalPlayers >= team.players_limit)
        throw new Error("Cannot Join Players Limit reach to maximum limit");
      // check if the user already exist in the team
      const exist = team.players_list.find(
        (player) => player._id.toString() === user_id
      );
      if (exist) throw new Error("You have already in the team");
      //
      if (team.leader._id.toString() === user_id)
        throw new Error("You are the leader of the team");
      //
      const alreadyRequested = team.request_list.find(
        (player) => player._id.toString() === user_id
      );
      if (alreadyRequested)
        throw new Error("You are already requested to join the team");

      if (team.isPrivate) team.request_list.push(user_id);
      else {
        team.players_list.push(user_id);
        await team.addToRoom(user_id);
      }

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
      const team = await Team.findById(team_id)
        .populate("leader")
        .populate("co_leaders")
        .populate("request_list")
        .populate("players_list");
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
        (player) => player._id.toString() === user__id
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
        (player) => player._id.toString() === user__id
      );
      if (index === -1) throw new Error("Don't have such request...");
      team.request_list.splice(index, 1);

      // adding the player to the list
      team.players_list.push(user__id);
      await team.addToRoom(user__id);

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

      const team = await Team.findById(team_id)
        .populate("leader")
        .populate("co_leaders")
        .populate("request_list")
        .populate("players_list");
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
        (player) => player._id.toString() === user_id.toString()
      );
      if (!exist) throw new Error("User not found.");

      team.request_list = team.request_list.filter(
        (player) => player._id.toString() !== user_id.toString()
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

      const team = await Team.findById(team_id)
        .populate("leader")
        .populate("co_leaders")
        .populate("request_list")
        .populate("players_list");
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
        (player) => player._id.toString() === user_id.toString()
      );
      if (!exist) throw new Error("No player found");

      team.players_list = team.players_list.filter(
        (player) => player._id.toString() !== user_id.toString()
      );
      // removing the player even if he is the co leader
      team.co_leaders = team.co_leaders.filter(
        (player) => player._id.toString() !== user_id.toString()
      );

      await team.removeFromRoom(user_id.toString());
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

      const team = await Team.findById(team_id)
        .populate("leader")
        .populate("co_leaders")
        .populate("request_list")
        .populate("players_list");
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
        (player) => player._id.toString() === user_id.toString()
      );
      if (!exist) throw new Error("No player found.");

      const alreadyLeader = team.co_leaders.find(
        (player) => player._id.toString() === user_id.toString()
      );
      if (alreadyLeader) throw new Error("Player is already a leader");

      // checking the limit for max number of co_leaders
      const max_numbers = team.rules.max_co_leader;
      if (team.co_leaders.length >= max_numbers)
        throw new Error("Max Number of co leaders limit exceeds");

      team.co_leaders.push(user_id);

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

      const team = await Team.findById(team_id)
        .populate("leader")
        .populate("co_leaders")
        .populate("request_list")
        .populate("players_list");
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
        (player) => player._id.toString() === user_id.toString()
      );
      if (!exist) throw new Error("Player Is not a leader");

      team.co_leaders = team.co_leaders.filter(
        (player) => player._id.toString() !== user_id.toString()
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

      const team = await Team.findById(team_id)
        .populate("leader")
        .populate("co_leaders")
        .populate("request_list")
        .populate("players_list");
      if (!team) throw new Error("No Team found");

      if (user_id === team.leader._id.toString())
        throw new Error("Leader cannot leave the team...");

      const exist = team.players_list.find(
        (player) => player._id.toString() === user_id
      );
      if (!exist) throw new Error("Player not Found");

      team.players_list = team.players_list.filter(
        (player) => player._id.toString() !== user_id
      );
      // removing if the user is co loader also;
      team.co_leaders = team.co_leaders.filter(
        (player) => player._id.toString() !== user_id
      );

      await team.removeFromRoom(user_id);
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
      const teams = await Team.find({ leader: req.user._id })
        .populate("leader")
        .populate("co_leaders")
        .populate("request_list")
        .populate("players_list");
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
