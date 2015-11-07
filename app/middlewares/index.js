'use strict';

const _        = require('lodash');
const debug    = require('debug')('middlewares');
const BPromise = require('bluebird');
const path     = require('path');
const session  = require('express-session');
const RdbStore = require('session-rethinkdb')(session);

const config   = require(path.join(__dirname, '../config'));
const errors   = require(path.join(__dirname, '../lib/errors'));
const User     = require(path.join(__dirname, '../db/models/user'));
const utils    = require(path.join(__dirname, '../lib/utils'));

const r            = config.models.r;
const sessionStore = new RdbStore(config.session);

// Current User
function setCurrentUser(req, res, next) {
  req._currentUser = req.user;
  next();
}

function checkCurrentUser(req, res, next) {
  debug(req.originalUrl, 'Checking current user', !!req._currentUser);
  if (req._currentUser) {
    next();
  } else {
    next(new errors.UnAuthenticatedApiError('You are not authenticated to perform this request', 403));
  }
}

// Session
function getSessionMiddleware() {
  return session({
    secret: 'lolstack awesome',
    store: sessionStore,
    saveUninitialized: true,
    resave: true
  });
}

// Query logger
function queryLogger(req, res, next) {
  debug(req.method, req.originalUrl, req.query, req.body);
  next();
}

// Error Handling Middlewares
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  debug(req.originalUrl, utils.formatError(err));
  res.format({
    'application/json': function(){
      if (err.toJSON) {
        res.status(statusCode).send({
          error: err.toJSON()
        });
      } else {
        res.status(statusCode).send({
          error: {
            message: err.message || "Request Failed. Please try again later"
          }
        });
      }
    },

    'default': function() {
      res.status(statusCode).render('err/5xx.jade');
    }
  });
}

function NotFoundHandler(req, res, next) {
  debug(req.originalUrl, '404: Handling 404');

  res.format({
    'application/json': function(){
      res.status(404).send({
        error: {
          message: "No such resource"
        }
      });
    },

    'default': function() {
      res.status(404).render('err/4xx.jade');
    }
  });
}

module.exports = {
  setCurrentUser,
  checkCurrentUser,
  getSessionMiddleware,
  queryLogger,
  errorHandler,
  NotFoundHandler
};