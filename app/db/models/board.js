'use strict';

const _    = require('lodash');
const path = require('path');

const config         = require(path.join(__dirname, '../../config'));
const ClassWithProps = require(path.join(__dirname, '../../lib/class_with_props'));

const r          = config.models.r;
const BoardModel = config.models.Board;
const UserModel  = config.models.User;

class Board extends ClassWithProps {
  constructor(json) {
    super(json);
  }

  get Model() {
    return BoardModel;
  }

  static get Model() {
    return BoardModel;
  }

  incrementViews() {
    return BoardModel.get(this.getProp('id')).update({ views: r.row("views").add(1).default(0) }).run();
  }

  update(params) {
    return BoardModel.get(this.getProp('id')).update(params).run()
      .then(() => Board.get(this.getProp('id')));
  }

  delete() {
    return BoardModel.get(this.getProp('id')).delete().run();
  }

  static getJson(boardId) {
    return BoardModel.get(boardId).run()
      .then((boardJson) => boardJson);
  }

  static get(boardId) {
    return this.getJson(boardId)
      .then((boardJson) => (boardJson) ? new Board(boardJson) : null);
  }

  static getWithUser(boardId) {
    return BoardModel.getAll(boardId, { index: 'id' }).eqJoin('user_id', UserModel, { index: 'id' }).without({ right: ['access_token', 'access_token_secret'] }).run()
      .then((results) => {
        if (!results || results.length === 0) {
          return null;
        }
        let result = results[0];
        return new Board(Object.assign({}, result.left, { user: result.right }));
      });
  }

  static create(boardJson) {
    const newBoardJson = Object.assign({ views: 0, created_at: Date.now(), published: boardJson.cards && boardJson.cards.length !== 0 }, boardJson);
    return BoardModel.insert(newBoardJson).run()
      .then((result) => {
        if (result.inserted === 1) {
          return new Board(Object.assign({}, newBoardJson, { id: result.generated_keys[0] }));
        }
      });
  }

  static paginate(params) {
    let cursor = params.cursor;
    let count = params.count;
    let order = params.order;
    order = (['asc', 'desc'].indexOf(order) > -1) ? order : 'desc';

    cursor = parseInt(cursor);
    cursor = _.isFinite(cursor) ? cursor : -1;

    if (cursor === 0) {
      return BPromise.resolve([]);
    }

    count = parseInt(count) || 10;
    count = _.min([100, _.max([1, count])]);

    let query;
    if (order === 'desc') {
      cursor = (cursor === -1 || cursor === '-1') ? r.maxval : cursor;
      query = BoardModel.between([true, r.minval], [true, cursor], { index: 'published_created_at' }).orderBy(r.desc('created_at')).limit(count);
    } else {
      cursor = (cursor === -1 || cursor === '-1') ? r.minval : cursor;
      query = BoardModel.between([true, cursor], [true, r.maxval], { index: 'published_created_at', leftBound: 'open' }).orderBy('created_at').limit(count);
    }
    return query.eqJoin('user_id', UserModel, { index: 'id' }).without({ right: ['access_token', 'access_token_secret'] }).run()
      .then((results) => results.map((result) => Object.assign(result.left, { user: result.right })));
  }

  static forUser(user_id) {
    return BoardModel.getAll(user_id, { index: 'user_id' }).orderBy(r.desc('created_at')).run();
  }

  static getMostPopular(count) {
    count = parseInt(count) || 5;
    count = _.min([20, _.max([1, count])]);
    return BoardModel.orderBy({ index: r.desc('views') }).limit(count).eqJoin('user_id', UserModel, { index: 'id' }).without({ right: ['access_token', 'access_token_secret'] }).run()
      .then((results) => results.map((result) => Object.assign(result.left, { user: result.right })));
  }

  static getMostRecent(count) {
    count = parseInt(count) || 5;
    count = _.min([20, _.max([1, count])]);
    return BoardModel.orderBy({ index: r.desc('created_at') }).limit(count).eqJoin('user_id', UserModel, { index: 'id' }).without({ right: ['access_token', 'access_token_secret'] }).run()
      .then((results) => results.map((result) => Object.assign(result.left, { user: result.right })));
  }
}

module.exports = Board;
