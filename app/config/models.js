'use strict';

const Jamadar = require('jamadar');
const path    = require('path');

function configuration(env) {
  const rethinkdb = require(path.join(__dirname, './rethinkdb'))(env);

  const db = new Jamadar(rethinkdb.hosts);

  const config = {
    db:       db,
    r:        db.r,
    Session:  db.Model(rethinkdb.hosts.db, rethinkdb.tables.sessions).model,
    User:     db.Model(rethinkdb.hosts.db, rethinkdb.tables.users).model,
    Board:    db.Model(rethinkdb.hosts.db, rethinkdb.tables.boards).model
  };
  return config;
}

module.exports = configuration;
