'use strict';
const path = require('path');

function configuration(env) {
  return {
    name:       'PLACEHOLDER_NAME',
    express:    require(path.join(__dirname, './express'))(env),
    rethinkdb:  require(path.join(__dirname, './rethinkdb'))(env),
    session:    require(path.join(__dirname, './session'))(env),
    twitter:    require(path.join(__dirname, './twitter'))(env),
    models:    require(path.join(__dirname, './models'))(env),
  };
}

module.exports = configuration(process.env.NODE_ENV);