'use strict';

const path = require('path');
const app   = require('./app');
const debug = require('debug')('lolstack:index');
const config = require(path.join(__dirname, './config'));

const db     = config.models.db;
const r      = config.models.r;

db.migrate(config.rethinkdb.hosts.db, config.rethinkdb.tables, config.rethinkdb.indexes)
  .then(() => {
    debug('Database setup complete');

    app.listen(config.express.port, function(error) {
      if (error) {
        console.log(error);
        return;
      }
      debug('Listening on port http://localhost:' + config.express.port);
    });

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
