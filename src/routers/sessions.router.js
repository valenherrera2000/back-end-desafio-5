import { Router } from 'express';
import passport from 'passport';
import userSchema from '../models/user.model.js';

const router = Router();

// Configuración de Passport
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userSchema.findById(id, (err, user) => {
    done(err, user);
  });
});

router.post('/sessions/register', async (req, res) => {
  const { body } = req;
  body.role = 'usuario';  
  body.password = userSchema.generateHash(body.password);
  const newUser = await userSchema.create(body);
  console.log('newUser', newUser);
  res.redirect('/login');
});


passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, async (req, email, password, done) => {
  try {
    const user = await userSchema.findOne({ email });
    if (!user || !user.validPassword(password)) {
      return done(null, false, { message: 'Correo o contraseña inválidos 😨.' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

router.post(
  '/sessions/login',
  passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true,
  }),
);

router.get('/sessions/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

export default router;
