import { Router } from 'express';
import userSchema from '../models/user.model.js';
import productSchema from '../models/product.model.js';

const router = Router();

const privateRouter = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

const publicRouters = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/profile');
  }
  next();
};

router.get('/profile', privateRouter, async (req, res) => {
  try {
    const user = await userSchema.findById(req.session.user._id);
    const allProducts = await productSchema.find();  // Retrieve all products from the database
    res.render('profile', { title: 'Perfil', user, products: allProducts });
  } catch (error) {
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/login', publicRouters, (req, res) => {
  res.render('login', { title: 'Login' });
});

router.get('/register', publicRouters, (req, res) => {
  res.render('register', { title: 'Register' });
});

router.get('/products', privateRouter, async (req, res) => {
  try {
    const allProducts = await productSchema.find();
    res.render('products', { title: 'Productos', user: req.session.user, products: allProducts });
  } catch (error) {
    res.status(500).send('Error interno del servidor');
  }
});

export default router;
