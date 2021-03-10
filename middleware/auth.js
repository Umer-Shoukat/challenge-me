const auth = (req, res, next) => {
  console.log("auth middle ware run...");
  next();
};

module.exports = auth;
