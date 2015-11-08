'use strict';

const bodyParser      = require('body-parser');
const express         = require('express');
const flash           = require('connect-flash');
const logger          = require('morgan');
const passport        = require('passport');
const path            = require('path');
const TwitterStrategy = require('passport-twitter').Strategy;

const config         = require(path.join(__dirname, './config'));
const Middlewares    = require(path.join(__dirname, './middlewares'));

const authRouter     = require(path.join(__dirname, './routes/auth'));
const boardRouter    = require(path.join(__dirname, './routes/board'));
const userRouter     = require(path.join(__dirname, './routes/user'));
const indexRouter    = require(path.join(__dirname, './routes/index'));

const User = require(path.join(__dirname, './db/models/user'));

const app     = express();


passport.use(new TwitterStrategy(config.twitter,
  function(token, tokenSecret, profile, done) {

    User.findOrCreateUser(profile, token, tokenSecret)
      .then((user) => done(null, user))
      .catch(done);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Create a static file server
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/dist', express.static(path.join(__dirname, '../dist')));

if (process.env.NODE_ENV === 'production') {
  app.use(logger('combined'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(Middlewares.getSessionMiddleware());
app.use(passport.initialize());
app.use(passport.session());

app.use(Middlewares.setCurrentUser);


app.use(Middlewares.queryLogger);

app.use('/auth'       , authRouter);
app.use('/api/boards' , boardRouter);
app.use('/api/user'   , userRouter);
app.use('/'           , indexRouter);

app.use(Middlewares.NotFoundHandler);
app.use(Middlewares.errorHandler);


/*
app.get('*', (req, res) => {
  debug(req.originalUrl);
  res.status(200).sendFile(path.join(__dirname, '../public/index.html'));
}); */

//Get the dummy data
//require('./server/ddata.js');

module.exports = app;
