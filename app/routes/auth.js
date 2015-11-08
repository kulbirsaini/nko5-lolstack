'use strict';

const passport = require('passport');
const path     = require('path');
const router   = require('express').Router();

const config  = require(path.join(__dirname, '../config'));
const User    = require(path.join(__dirname, '../db/models/user'));
const utils   = require(path.join(__dirname, '../lib/utils'));

const debug = require('debug')('routes:auth');

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });


router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
