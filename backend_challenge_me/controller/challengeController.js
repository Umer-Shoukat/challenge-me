const moment = require("moment");
const Challenge = require("../model/Challenge");

const { handleErrors } = require("../helpers/helpers");

module.exports = {
  async createChallenge(req, res) {
    try {
      const fields = Object.keys(req.body);
      const requiredFields = [
        "name",
        "description",
        "type",
        "is_private",
        "is_physical",
        "start_time",
        "end_time",
      ];
      const validFields = requiredFields.every((field) =>
        fields.includes(field)
      );
      if (!validFields) throw new Error("Invalid Fields or missing");
      const {
        is_physical,
        location,
        type,
        creator_team_id,
        start_time,
      } = req.body;
      // time for the challenge must be 10 min after current Time
      const validTime = moment(new Date(start_time)).isAfter(
        moment(new Date()).add(10, "minutes")
      );
      if (!validTime)
        throw new Error("Time should be atleast 10 min from the current time");
      // if game is physical and there is no location
      if (is_physical && !location)
        throw new Error(
          "location is required if the challenge require physical location"
        );
      // if challenge type is team and user don't provide the team id
      if (type === "team" && !creator_team_id)
        throw new Error(
          "You must have a team to create a challenge for a team"
        );
      // todo:: make another check to see if the challenge type is team and creator is the admin/leader of the team

      const challenge = new Challenge(req.body);
      challenge.creator = req.user._id;
      await challenge.save();

      res.status(201).send({ challenge });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // --------------------------------------------
  // --------GET SINGLE CHALLENGE----------------
  // --------------------------------------------
  async getSingleChallenge(req, res) {
    try {
      const challenge = await Challenge.findById(req.params.id)
        .populate("creator")
        .populate("challenger_team")
        .populate("user_requests")
        .populate("team_requests")
        .populate("open_players_list");
      if (!challenge) throw new Error("No CHallenge found...!");

      res.status(200).send({ challenge });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // -----------------------------------------------
  // --------GET LIST OF CHALLENGES ----------------
  // -----------------------------------------------
  async getChallengesList(req, res) {
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

      let challenges = await Challenge.paginate(
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
            docs: "challenges",
          },
        }
      );

      res.status(200).send(challenges);
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // ------------------------------------------
  // --------UPDATE CHALLENGE-----------------
  // -----------------------------------------
  async updateChallenge(req, res) {
    try {
      const id = req.body.id;
      delete req.body.id;

      const fieldsForUpdates = Object.keys(req.body);
      const fieldsCanUpdate = [
        "name",
        "description",
        "type",
        "is_private",
        "is_physical",
        "start_time",
        "end_time",
        "creator_team",
      ];

      const validInputs = fieldsForUpdates.every((field) =>
        fieldsCanUpdate.includes(field)
      );
      if (!validInputs) throw new Error("Invalid fields");

      const {
        start_time,
        is_physical,
        location,
        type,
        creator_team,
      } = req.body;

      const validTime = moment(new Date(start_time)).isAfter(
        moment(new Date()).add(10, "minutes")
      );
      if (!validTime)
        throw new Error("Time should be atleast 10 min from the current time");
      // if game is physical and there is no location
      if (is_physical && !location)
        throw new Error(
          "location is required if the challenge require physical location"
        );
      // if challenge type is team and user don't provide the team id
      if (type === "team" && !creator_team)
        throw new Error(
          "You must have a team to create a challenge for a team"
        );

      const challenge = await Challenge.findById(id)
        .populate("creator")
        .populate("challenger_team")
        .populate("user_requests")
        .populate("team_requests")
        .populate("open_players_list");
      if (!challenge) throw new Error("Challenge not found");

      // check if the user is authorized to make changes
      challenge.isCreator(req.user);

      fieldsForUpdates.forEach((field) => (challenge[field] = req.body[field]));

      await challenge.save();

      res.status(201).send({ challenge });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // ------------------------------------------
  // --------DELETE CHALLENGE-----------------
  // -----------------------------------------
  async deleteChallenge(req, res) {
    try {
      const challenge = await Challenge.findById(req.body.id)
        .populate("creator")
        .populate("challenger_team")
        .populate("user_requests")
        .populate("team_requests")
        .populate("open_players_list");
      if (!challenge) throw new Error("No challenge Found");

      // checking if the user is authorized to delete the challenge
      challenge.isCreator(req.user);
      await challenge.remove();

      res.status(201).send({ challenge });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // -------------------------------------------
  // --------ADD CHALLENGE ROLES----------------
  // -------------------------------------------
  async addChallengeRules(req, res) {
    try {
      const rulesCanChange = [
        "max_team_players",
        "min_team_players",
        "max_age",
        "min_age",
        "max_number_players",
      ];

      const rules = Object.keys(req.body.rules);

      const validRules = rules.every((rule) => rulesCanChange.includes(rule));
      if (!validRules) throw new Error("Invalid Rules");

      const challenge = await Challenge.findById(req.body.id)
        .populate("creator")
        .populate("challenger_team")
        .populate("user_requests")
        .populate("team_requests")
        .populate("open_players_list");
      if (!challenge) throw new Error("No challenge Found");

      challenge.isCreator(req.user);
      rules.forEach((rule) => (challenge.rules[rule] = req.body.rules[rule]));

      await challenge.save();
      res.status(201).send({ challenge });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // -----------------------------------------------
  // --------REQUEST FOR A CHALLENGE----------------
  // -----------------------------------------------
  async requestChallenge(req, res) {
    try {
      // todo:: will validate it according to the rules of the game...
      const { id, team_id } = req.body;
      const challenge = await Challenge.findById(id)
        .populate("creator")
        .populate("challenger_team")
        .populate("user_requests")
        .populate("team_requests")
        .populate("open_players_list");
      if (!challenge) throw new Error("No challenge found");
      const { challenger, is_private, type } = challenge;
      if (challenger) throw new Error("Someone has already challenged...");

      // checking if the user already challenged;
      challenge.hasRequested(req.user._id);

      // checking the challenge type
      if (type === "team") {
        if (!team_id)
          throw new Error(
            "You must provide the team if the challenge type is TEAM"
          );
        if (!is_private) {
          challenge.challenger_team = team_id;
          challenge.challenger = req.user._id;
        } else {
          challenge.user_requests.push(req.user._id);
          challenge.team_requests.push(team_id);
        }
      } else if (type === "solo") {
        if (!is_private) challenge.challenger = req.user._id;
        else {
          challenge.user_requests.push(req.user._id);
        }
      } else {
        // if the challenge type is open;
        const exist = challenge.open_players_list.find(
          (c) => c._id.toString() === req.user._id.toString()
        );
        if (exist) throw new Error("You are already in the players list");
        if (!is_private) challenge.open_players_list.push(req.user._id);
        else {
          challenge.user_requests.push(req.user._id);
        }
      }
      await challenge.save();
      res.status(201).send({ challenge });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // -------------------------------------------------
  // --------ACCEPT CHALLENGER REQUEST----------------
  // -------------------------------------------------
  async acceptChallenge(req, res) {
    try {
      const { team_id, user_id, id } = req.body;
      const challenge = await Challenge.findById(id)
        .populate("creator")
        .populate("challenger_team")
        .populate("user_requests")
        .populate("team_requests")
        .populate("open_players_list");
      if (!challenge) throw new Error("No challenge found");

      // if the challenger already exist
      if (challenge.challenger) {
        challenge.challenge_requests = [];
        await challenge.save();
        throw new Error("Challenger ALready Exist");
      }

      challenge.isCreator(req.user);

      const {
        type,
        user_requests,
        team_requests,
        open_players_list,
      } = challenge;

      // checking if the team and user exist in the challenge
      const userExist = user_requests.find(
        (user) => user._id.toString() === user_id.toString()
      );
      let teamExist;
      if (type === "team")
        teamExist = team_requests.find(
          (team) => team._id.toString() === team_id.toString()
        );

      if (!userExist && !teamExist)
        throw new Error("No request found with such challenger");

      if (type === "team") {
        challenge.challenger = user_id;
        challenge.challenger_team_ = team_id;
      } else if (type === "solo") {
        challenge.challenger = user_id;
      } else {
        const exist = open_players_list.find(
          (user) => user._id.toString() === user_id.toString()
        );
        if (exist) throw new Error("User Already exist in the open team...");

        challenge.open_players_list.push(user_id);
      }

      challenge.user_requests = [];
      challenge.team_requests = [];
      await challenge.save();
      res.status(201).send({ challenge });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // -------------------------------------------------
  // --------REJECT CHALLENGER REQUEST----------------
  // -------------------------------------------------
  async rejectChallenge(req, res) {
    try {
      const { team_id, user_id, id } = req.body;
      const challenge = await Challenge.findById(id)
        .populate("creator")
        .populate("challenger_team")
        .populate("user_requests")
        .populate("team_requests")
        .populate("open_players_list");
      if (!challenge) throw new Error("No Challenge Found");
      challenge.isCreator(req.user);

      const { user_requests, team_requests, type } = challenge;

      const userExist = user_requests.find(
        (user) => user._id.toString() === user_id.toString()
      );
      let teamExist;
      if (type === "team")
        teamExist = team_requests.find(
          (team) => team._id.toString() === team_id.toString()
        );

      if (!userExist && !teamExist)
        throw new Error("No request found with such challenger");

      challenge.user_requests.filter(
        (user) => user._id.toString() !== user_id.toString()
      );

      if (type === "team")
        challenge.team_requests.filter(
          (team) => team._id.toString() !== team_id.toString()
        );

      await challenge.save();
      res.status(201).send({ challenge });
    } catch (error) {
      handleErrors(res, error);
    }
  },

  // ------------------------------------------
  // --------REMOVE CHALLENGER----------------
  // -----------------------------------------
  async removeChallenger(req, res) {
    try {
      const { user_id, id } = req.body;
      const challenge = await Challenge.findById(id)
        .populate("creator")
        .populate("challenger_team")
        .populate("user_requests")
        .populate("team_requests")
        .populate("open_players_list");
      if (!challenge) throw new Error("Challenge not found");
      challenge.isCreator(req.user);
      const { type, open_players_list } = challenge;
      if (type === "team") {
        delete challenge.challenger;
        delete challenge.challenger;
      } else if (type === "solo") {
        delete challenge.challenger;
      } else {
        if (!user_id)
          throw new Error(
            "You must provide the user id to remove the challenger"
          );
        challenge.open_players_list = open_players_list.filter(
          (player) => player._id.toString() !== user_id.toString()
        );
      }
      await challenge.save();
      res.status(201).send({ challenge });
    } catch (error) {
      handleErrors(res, error);
    }
  },
  // ---------------------------------------------------
  // --------GET CURRENT USER CHALLENGES----------------
  // ---------------------------------------------------
  async getMyChallenges(req, res) {
    try {
      let challenges = await Challenge.find({ creator: req.user._id })
        .populate("creator")
        .populate("challenger_team")
        .populate("user_requests")
        .populate("team_requests")
        .populate("open_players_list");

      res.status(200).send({ challenges });
    } catch (error) {
      handleErrors(res, error);
    }
  },
};
