'use strict';

const path = require('path');

function configuration(env) {
  const rethinkdb = require(path.join(__dirname, './rethinkdb'))(env);
  const config = Object.assign({}, rethinkdb.hosts, { table: 'sessions' });
  return config;
}

module.exports = configuration;
