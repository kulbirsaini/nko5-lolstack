'use strict';

const path     = require('path');

const config         = require(path.join(__dirname, '../../config'));
const ClassWithProps = require(path.join(__dirname, '../../lib/class_with_props'));
const Board          = require(path.join(__dirname, './board'));

const UserModel  = config.models.User;

class User extends ClassWithProps {
  constructor(json) {
    super(json);
  }

  get Model() {
    return UserModel;
  }

  static get Model() {
    return UserModel;
  }

  save() {
    return UserModel.get(this.getProp('id')).update(this.getPropsWithout('id')).run()
      .then((result) => result.replaced === 1);
  }

  getBoards() {
    const currentUserProps = this.getPropsWithout(['access_token', 'access_token_secret']);
    return Board.forUser(this.getProp('id'))
      .then((boards) => boards.map((board) => Object.assign({}, board, { user: currentUserProps })));
  }

  static findOrCreateUser(profile, token, tokenSecret) {
    const userJson = {
      twitter_id: profile.id,
      provider_handle: profile.handle,
      name: (profile.displayName || '').replace(/\0/g, ''),
      screen_name: profile.userName,
      description: (profile._json.description || '').replace(/\0/g, ''),
      profile_image_url: profile._json.profile_image_url,
      profile_banner_url: profile._json.profile_banner_url,
      access_token: token,
      access_token_secret: tokenSecret
    };

    return User.findByTwitterId(profile.id)
      .then((user) => !user ? User.create(userJson) : user);
  }

  static findByTwitterId(twitterId) {
    return User.Model.getAll(twitterId, { index: 'twitter_id' }).limit(1).run()
      .then((results) => {
        return results.length === 0 ? null : new User(results[0])
      });
  }

  static getJson(userId) {
    return UserModel.get(userId).run()
      .then((userJson) => userJson);
  }

  static get(userId) {
    return this.getJson(userId)
      .then((userJson) => (userJson) ? new User(userJson) : null);
  }

  static create(userJson) {
    return UserModel.insert(userJson).run()
      .then((result) => {
        if (result.inserted === 1) {
          return new User(Object.assign({}, userJson, { id: result.generated_keys[0] }));
        }
      });
  }
}

module.exports = User;
