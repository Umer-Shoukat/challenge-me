const Team = require("../model/Team");

const { handleErrors } = require("../helpers/helpers");

const createTeam = async (req, res) => {
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
};

const myTeams = async (req, res) => {
  try {
    const teams = await Team.find({ leader_id: req.user._id });
    res.status(201).send({ teams });
  } catch (error) {
    handleErrors(res, error);
  }
};

const viewTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) throw new Error("No Team Found");
    res.status(200).send({ team });
  } catch (error) {
    handleErrors(res, error);
  }
};

const updateTeam = async (req, res) => {
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
    if (!team.isLeader(req.user)) {
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
};

const deleteTeam = async (req, res) => {
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
};

const getTeams = async (req, res) => {
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
};

const requestToJoin = async (req, res) => {
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
      (player_id) => player_id.toString() === user_id
    );
    if (exist) throw new Error("You have already in the team");
    //
    if (team.leader_id.toString() === user_id)
      throw new Error("You are the leader of the team");
    //
    const alreadyRequested = team.request_list.find(
      (reqId) => reqId.toString() === user_id
    );
    if (alreadyRequested)
      throw new Error("You are already requested to join the team");

    if (team.isPrivate) team.request_list.push(user_id);
    else team.players_list.push(user_id);

    await team.save();
    res.status(201).send({ team });
  } catch (error) {
    handleErrors(res, error);
  }
};

const acceptPlayer = async (req, res) => {
  try {
    const { team_id, user_id } = req.body;
    const user__id = user_id.toString();

    const team = await Team.findById(team_id);
    if (!team) throw new Error("No team Found");

    // return team;

    if (!team.isLeader(req.user))
      throw new Error("You are not authorized to accept player");
    // checking if the user already in the
    const exist = team.players_list.find((id) => id.toString() === user__id);
    if (exist) throw new Error("User is already in the Team...");

    // check if there is limit for the team players to add
    const totalPlayers = team.players_list.length;
    if (totalPlayers >= team.players_limit)
      throw new Error(
        "Cannot Accept player bcz maximum players added in the list"
      );

    // removing the user from request list
    team.request_list = team.request_list.filter(
      (id) => id.toString() !== user__id
    );

    // adding the player to the list
    team.players_list.push(user__id);

    await team.save();

    res.status(201).send({ team });
  } catch (error) {
    handleErrors(res, error);
  }
};

const rejectPlayer = async (req, res) => {
  try {
  } catch (error) {
    handleErrors(res, error);
  }
};

const removePlayer = async (req, res) => {
  try {
  } catch (error) {
    handleErrors(res, error);
  }
};

const makeCoLeader = async (req, res) => {
  try {
  } catch (error) {
    handleErrors(res, error);
  }
};

const removeCoLeader = async (req, res) => {
  try {
  } catch (error) {
    handleErrors(res, error);
  }
};

const leaveTeam = async (req, res) => {
  try {
  } catch (error) {
    handleErrors(res, error);
  }
};

module.exports = {
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
};
