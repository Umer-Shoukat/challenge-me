const mongoose = require("mongoose");
mongoose.connect(
  process.env.DATABASE_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) console.log(err);
  }
);
