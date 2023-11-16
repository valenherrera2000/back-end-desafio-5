import { Router } from 'express';
import userSchema from '../models/user.model.js';

const router = Router();

router.post('/sessions/register', async (req, res) => {
  const { body } = req;
  body.role = 'usuario';  
  const newUser = await userSchema.create(body);
  console.log('newUser', newUser);
  res.redirect('/login');
});

router.post('/sessions/login', async (req, res) => {
  const { body: { email, password } } = req;
  const user = await userSchema.findOne({ email });
  if (!user) {
    return res.status(401).send('Correo o contraseña invalidos 😨.');
  }
  const isPassValid = user.password === password;
  if (!isPassValid) {
    return res.status(401).send('Correo o contraseña invalidos 😨.');
  }
  const { first_name, last_name, role } = user;
  req.session.user = { first_name, last_name, email, role: role || 'usuario' };  // Set a default role if not present
  res.redirect('/profile');
});


router.get('/sessions/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/login');
  });
});

export default router;