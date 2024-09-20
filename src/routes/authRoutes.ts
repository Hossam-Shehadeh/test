import { Router } from 'express';
import { signUp, signIn } from '../controllers/authController';
import passport from 'passport';

const router = Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/');
  }
);

export default router;
