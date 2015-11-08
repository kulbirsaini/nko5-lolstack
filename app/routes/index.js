'use strict';

const router = require('express').Router();

router.get('/', function(req, res) {
  if (req._currentUser) {
    res.render('pages/home');
  } else {
    res.render('pages/login');
  }
});

module.exports = router;
