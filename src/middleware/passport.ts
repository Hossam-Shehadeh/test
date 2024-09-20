import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  const [user] = await User.findOrCreate({
    where: { googleId: profile.id },
    defaults: { username: profile.displayName },
  });
  return done(null, user);
}));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: number, done) => {
  User.findByPk(id).then(user => {
    done(null, user);
  });
});
