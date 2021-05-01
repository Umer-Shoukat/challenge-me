const faker = require("faker");
const express = require("express");
const router = new express.Router();

// modals
const User = require("../model/User");
const Team = require("../model/Team");

// middleware
// const authMiddleware = require("../middleware/auth");

const createUserData = (count = 1) => {
  let arr = [];

  const user = faker.name;
  const image = faker.image;
  const internet = faker.internet;

  for (let i = 1; i <= count; i++) {
    const name = user.firstName();
    arr.push({
      avatar: image.avatar(),
      name,
      email: internet.email(name),
      password: "$2b$08$kGtYZJtdBUZkW1UuisXX4eAxbbn1X014BTYeOQjK5bXn9TfY2wfWW", // abcdabcd
      dob: "11/12/1998",
    });
  }

  return arr;
};

const createTeams = (id) => {
  const lorem = faker.lorem;
  const image = faker.image;
  const datatype = faker.datatype;
  const vehicle = faker.vehicle;

  const arr = [];

  for (let index = 0; index < 5; index++) {
    arr.push({
      name: vehicle.vehicle(),
      description: lorem.words(100),
      isPrivate: datatype.boolean(),
      players_limit: datatype.number({ min: 2, max: 8 }),
      leader: id,
      images: {
        image: image.avatar(),
        backgroundImage: image.imageUrl(1200, 400),
      },
    });
  }

  return arr;
};

router.get("/seed-user", async (req, res) => {
  try {
    const { count } = req.query;
    const users = createUserData(count ? count : 50);
    await User.insertMany(users);
    res.status(200).send({ msg: "Successfully created users" });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

router.get("/seed-team/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) throw new Error("User not found...!");

    await Team.insertMany(createTeams(id));

    res.send({ msg: "CReated" });
  } catch (error) {
    res.status(500).send({ error: JSON.stringify(error) });
    console.log(error);
  }
});

module.exports = router;
