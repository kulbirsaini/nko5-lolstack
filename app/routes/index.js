'use strict';

const path   = require('path');
const router = require('express').Router();

const Middlewares = require(path.join(__dirname, '../middlewares'));

router.get('/', function(req, res) {
  console.log(req.originalUrl);
  if (req._currentUser) {
    res.render('pages/home');
  } else {
    res.render('pages/login');
  }
});

router.use('/boards', Middlewares.checkCurrentUser);

router.use('/boards/:board_id', Middlewares.setCurrentBoard);

router.get('/boards/:board_id', function(req, res, next) {
  if (req._currentBoard) {
    return res.render('pages/board');
  }
  next();
});

router.get('/boards', function(req, res) {
  res.render('pages/boards');
});

module.exports = router;
