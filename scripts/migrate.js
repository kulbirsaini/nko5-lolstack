'use strict';


const path = require('path');
const debug = require('debug')('lolstack:migration');

const config = require(path.join(__dirname, '../app/config'));
const db     = config.models.db;
const r      = config.models.r;

db.migrate(config.rethinkdb.hosts.db, config.rethinkdb.tables, config.rethinkdb.indexes)
  .then(() => {
    debug('Database setup complete');
    r.getPoolMaster().drain();
  })
  .catch((error) => {
    debug('Error:', error.message);
    debug(error.stack);
    try {
      r.getPoolMaster().drain();
    } catch (err) {
      process.nextTick(() => process.exit(1));
    }
  });
