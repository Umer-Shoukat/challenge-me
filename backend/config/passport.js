const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const User = require("../model/User");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/v1/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          avatar: profile.photos[0].value,
          provider: "google",
        };

        console.log("Profile from google", profile);

        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log("SERIALIZE USER", user);
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      console.log("DESERIALIZE USER", user);
      if (err) return done(err, null);
      if (!user) return done("No User found", null);
      done(null, user);
    });
  });
};
