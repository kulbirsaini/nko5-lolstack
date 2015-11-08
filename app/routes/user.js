'use strict';

const path   = require('path');
const router = require('express').Router();

const errors      = require(path.join(__dirname, '../lib/errors'));
const Middlewares = require(path.join(__dirname, '../middlewares'));

router.use(Middlewares.checkCurrentUser);

router.route('/boards')
  .get(function(req, res, next) {
    return req._currentUser.getBoards()
      .then((boards) => res.status(200).send({ boards }))
      .catch((err) => next(new errors.GenericApiError('Unable to retrive user boards.', 500, err)));
  });

module.exports = router;
