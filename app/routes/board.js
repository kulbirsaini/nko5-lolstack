'use strict';

const _      = require('lodash');
const path   = require('path');
const router = require('express').Router();

const errors      = require(path.join(__dirname, '../lib/errors'));
const Board       = require(path.join(__dirname, '../db/models/board'));
const Middlewares = require(path.join(__dirname, '../middlewares'));

router.route('/')
  .get(function(req, res, next) {
    return Board.paginate(req.query)
      .then((boards) => {
        const data = {
          next_cursor: (boards.length === 0) ? 0 : _.last(boards).created_at,
          prev_cursor: req.query.cursor || -1,
          boards: boards
        };
        return res.status(200).send(data);
      })
      .catch((err) => next(new errors.GenericApiError('Unable to retrive boards.', 500, err)));
  })
  .post(
    Middlewares.checkCurrentUser,
    Middlewares.verifyNewBoardParams,
    function (req, res, next) {
      return Board.create(req._boardParams)
        .then((new_board) => {
          if (new_board) {
            return res.status(200).send(new_board.toJSON());
          }
          return next(new errors.GenericApiError('Unable to save board', 422));
        })
        .catch((err) => next(new errors.GenericApiError('Unable to save board.', 422, err)));
    }
  );

router.route('/popular')
  .get(function(req, res, next) {
    return Board.getMostPopular(req.query.count)
      .then((boards) => res.status(200).send(boards))
      .catch((err) => next(new errors.GenericApiError('Unable to retrive popular boards.', 500, err)));
  });

router.route('/recent')
  .get(function(req, res, next) {
    return Board.getMostRecent(req.query.count)
      .then((boards) => res.status(200).send(boards))
      .catch((err) => next(new errors.GenericApiError('Unable to retrive recent boards.', 500, err)));
  });

router.use('/:board_id', Middlewares.setCurrentBoard, Middlewares.checkCurrentBoard);

router.route('/:board_id')
  .get(
    Middlewares.incrementBoardView,
    function (req, res) {
      return res.status(200).send(req._currentBoard.toJSON());
    }
  )
  .delete(
    Middlewares.checkCurrentUser,
    Middlewares.verifyCurrentBoardOwnership,
    function (req, res, next) {
      return req._currentBoard.delete()
        .then(() => res.status(200).send({}))
        .catch((err) => next(new errors.GenericApiError('Unable to delete board.', 422, err)));
    }
  )
  .put(
    Middlewares.checkCurrentUser,
    Middlewares.verifyCurrentBoardOwnership,
    Middlewares.verifyExistingBoardParams,
    function (req, res, next) {
      return req._currentBoard.update(req._boardParams)
        .then((board) => res.status(200).send(Object.assign({}, board.toJSON(), { user: req._currentUser.getPropsWithout(['access_token', 'access_token_secret']) })))
        .catch((err) => next(new errors.GenericApiError('Unable to update board.', 422, err)));
    }
  );

module.exports = router;
