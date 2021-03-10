// all express related stuff;
const app = require("../server").app;

// middlewares && routes confifs will be here;

app.get("/", (req, res) => {
  res.send("hello world");
});

module.exports = app;
