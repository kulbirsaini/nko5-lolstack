'use strict';

const passport = require('passport');
const router   = require('express').Router();

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });


router.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
