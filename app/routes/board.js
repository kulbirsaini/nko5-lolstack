'use strict';

const _      = require('lodash');
const path   = require('path');
const router = require('express').Router();

const errors      = require(path.join(__dirname, '../lib/errors'));
const Board       = require(path.join(__dirname, '../db/models/board'));
const Middlewares = require(path.join(__dirname, '../middlewares'));

router.use(Middlewares.checkCurrentUser);

router.route('/')
  .get(function(req, res, next) {
    Board.paginate(req.query)
      .then((boards) => {
        const data = {
          next_cursor: (boards.length === 0) ? 0 : _.last(boards).created_at,
          prev_cursor: req.query.cursor || -1,
          boards: boards
        };
        res.status(200).send(data);
      })
      .catch((err) => next(new errors.GenericApiError('Unable to retrive boards.', 500, err)));
  })
  .post(
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

router.use('/:board_id', Middlewares.setCurrentBoard, Middlewares.checkCurrentBoard);

router.route('/:board_id')
  .get(function (req, res) {
    return res.status(200).send(req._currentBoard.toJSON());
  })
  .delete(function (req, res, next) {
    return req._currentBoard.delete()
      .then(() => res.status(200).send({}))
      .catch((err) => next(new errors.GenericApiError('Unable to delete board.', 422, err)));
  })
  .put(
    Middlewares.verifyExistingBoardParams,
    function (req, res, next) {
      return req._currentBoard.update(req._boardParams)
        .then((board) => res.status(200).send(board.toJSON()))
        .catch((err) => next(new errors.GenericApiError('Unable to update board.', 422, err)));
    }
  );

module.exports = router;
