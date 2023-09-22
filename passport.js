import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth2';
GoogleStrategy.Strategy;

passport.serializeUser((user, done) => {
    done(null, user);
})
passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    passReqToCallback: true
},async(request, accessToken, refreshToken, profile, email, done) => {
        return done(null, profile, email);
    }
));
