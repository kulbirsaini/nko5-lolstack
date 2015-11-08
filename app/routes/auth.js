'use strict';

const passport = require('passport');
const router   = require('express').Router();

function logout(req, res) {
  req.session.destroy();
  return res.redirect("/");
}

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });


router.get('/logout', logout);
router.delete('/logout', logout);
router.post('/logout', logout);

module.exports = router;
