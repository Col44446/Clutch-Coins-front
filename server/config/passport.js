const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            dob: null, // Explicitly null to avoid any issues
          });
          await user.save();
          console.log("New user created:", user); // Debug log
        }
        console.log("User for serialization:", user); // Debug log
        done(null, user);
      } catch (err) {
        console.error("Error in Google strategy:", err); // Debug log
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serializing user with ID:", user._id); // Use _id instead of id
  done(null, user._id); // Fix: Changed from user.id to user._id
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log("Deserialized user:", user); // Debug log
    done(null, user);
  } catch (err) {
    console.error("Error in deserializeUser:", err); // Debug log
    done(err, null);
  }
});