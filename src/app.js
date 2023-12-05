import express from 'express'; 
import passport from 'passport';
import LocalStrategy from 'passport-local';
import GitHubStrategy from 'passport-github';
import expressSession from 'express-session';
import handlebars from 'express-handlebars'
import path from 'path';
import mongoose from 'mongoose'; 
import MongoStore from 'connect-mongo';

import indexRouter from './routers/index.router.js';
import sessionsRouter from './routers/sessions.router.js';
import { __dirname } from './utils.js';
import { URI } from './db/mongodb.js';

const app = express();

const SESSION_SECRET = 'qBvPkU2X;J1,51Z!~2p[JW.DT|g:4l@';

const mongoStore = MongoStore.create({
  mongoUrl: URI,
  mongoOptions: {},
  ttl: 120,
});

app.use(expressSession({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: mongoStore,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use('/', indexRouter);
app.use('/api', sessionsRouter);
app.use((error, req, res, next) => {
  const message = `Ha ocurrido un error desconocido 😨: ${error.message}`;
  console.log(message);
  res.status(500).json({ status: 'error', message });
});

export default app;
