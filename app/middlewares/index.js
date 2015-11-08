'use strict';

const _        = require('lodash');
const debug    = require('debug')('lolstack:middlewares');
const path     = require('path');
const session  = require('express-session');
const RdbStore = require('session-rethinkdb')(session);

const config = require(path.join(__dirname, '../config'));
const errors = require(path.join(__dirname, '../lib/errors'));
const Board  = require(path.join(__dirname, '../db/models/board'));
const User   = require(path.join(__dirname, '../db/models/user'));
const utils  = require(path.join(__dirname, '../lib/utils'));

const sessionStore = new RdbStore(config.session);

const VALID_CARD_TYPES = ['twitter', 'youtube', 'imgur', 'instagram', 'vine'];

// Current User
function setCurrentUser(req, res, next) {
  if (req.user && req.user.props) {
    req._currentUser = new User(req.user.props);
  }
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

// Board
function setCurrentBoard(req, res, next) {
  debug(req.originalUrl, 'Setting board', req.params.board_id);
  if (req._currentBoard) {
    debug(req.originalUrl, 'Board already set');
    return next();
  }

  req._currentBoard = null;
  return Board.get(req.params.board_id)
    .then((board) => {
      if (board) {
        req._currentBoard = board;
        return next();
      }
      next(new errors.GenericApiError('Unable to find board', 404));
    })
    .catch(next)
}

function checkCurrentBoard(req, res, next) {
  debug(req.originalUrl, 'Checking board', req.params.board_id);
  if (req._currentBoard) {
    return next();
  }
  next(new errors.GenericApiError('Unable to find board', 404));
}

function verifyCards(cards) {
  if (!_.isArray(cards)) {
    return new errors.MissingParameterApiError("Invalid type of cards", 422);
  }

  if (cards.length === 0) {
    return new errors.MissingParameterApiError("Board should have at least one card", 422);
  }

  for(const card of cards) {
    if (!card.type || VALID_CARD_TYPES.indexOf(card.type) < 0) {
      return new errors.MissingParameterApiError("Invalid card type " + card.type, 422);
    }

    if (!card.elementId) {
      return new errors.MissingParameterApiError("Each card must have an elementId", 422);
    }

    if (!card.render || !_.isObject(card.render) || !card.render.id) {
      return new errors.MissingParameterApiError("Each card must have a valid parameters", 422);
    }
  }
  return null;
}

function verifyNewBoardParams(req, res, next) {
  req._boardParams = null;

  let boardParams = Object.assign({}, req.body.board);

  debug(req.originalUrl, 'Checking board parameters', boardParams);

  if (!boardParams.title) {
    return next(new errors.MissingParameterApiError("Board does not have a title", 422));
  }

  if (!boardParams.description) {
    return next(new errors.MissingParameterApiError("Board does not have a description", 422));
  }

  if (!boardParams.cards) {
    return next(new errors.MissingParameterApiError("Board does not have card(s)", 422));
  }

  const result = verifyCards(boardParams.cards);
  if (result) {
    return next(result);
  }

  boardParams.user_id = req._currentUser.getProp('id');
  req._boardParams = boardParams;
  return next();
}

function verifyExistingBoardParams(req, res, next) {
  req._boardParams = null;

  let boardParams = Object.assign({}, req.body.board);

  debug(req.originalUrl, 'Checking board parameters', boardParams);

  if (!boardParams.title && !boardParams.description && !boardParams.cards) {
    return next(new errors.MissingParameterApiError("No updates provided", 422));
  }

  if (boardParams.title !== undefined && !boardParams.title) {
    return next(new errors.MissingParameterApiError("Board does not have a title", 422));
  }

  if (boardParams.description !== undefined && !boardParams.description) {
    return next(new errors.MissingParameterApiError("Board does not have a description", 422));
  }

  if (boardParams.cards) {
    const result = verifyCards(boardParams.cards);
    if (!result) {
      return next(result);
    }
  }

  req._boardParams = boardParams;
  return next();
}

function verifyCurrentBoardOwnership(req, res, next) {
  if (req._currentUser.getProp('id') === req._currentBoard.getProp('user_id')) {
    return next();
  }
  next(new errors.GenericApiError('Unauthorized access to board', 403));
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
  setCurrentBoard,
  checkCurrentBoard,
  verifyNewBoardParams,
  verifyExistingBoardParams,
  verifyCurrentBoardOwnership,
  getSessionMiddleware,
  queryLogger,
  errorHandler,
  NotFoundHandler
};
