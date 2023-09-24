import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    passReqToCallback: true,
},async(request, accessToken, refreshToken, profile, email, done)=>{
        return done(null, profile, email);
    }
));
