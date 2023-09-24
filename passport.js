import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './model/User.js';

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
        const user = await User.findOne({ email:email.emails[0].value });
        if(!user) {
            request.session.isAuthenicated = false;
            request.session.user = null;
            await request.session.save();
            return done(null, false)
        }
        request.session.isAuthenicated = true;
        request.session.user = user;
        await request.session.save();
        return done(null, profile, email);
    }
));
