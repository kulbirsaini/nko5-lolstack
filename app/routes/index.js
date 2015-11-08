'use strict';

const path   = require('path');
const router = require('express').Router();

const Middlewares = require(path.join(__dirname, '../middlewares'));

function getCurrentUserId() {
  try {
    return req._currentUser.getProp('id');
  } catch (error) {
    return null;
  }
}

router.get('/', function(req, res) {
  if (req._currentUser) {
    return res.render('pages/home', { current_user: getCurrentUserId() });
  } else {
    return res.render('pages/login');
  }
});

router.use('/boards/:board_id', Middlewares.setCurrentBoard);

router.get('/boards/:board_id', function(req, res, next) {
  if (req._currentBoard) {
    return res.render('pages/board', { current_user: getCurrentUserId() });
  }
  next();
});

router.get('/boards', function(req, res) {
  return res.render('pages/boards', { current_user: getCurrentUserId() });
});

module.exports = router;
