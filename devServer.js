'use strict';

require('babel/register');

const debug   = require('debug')('lolstack:devServer');
const express = require('express');
const path    = require('path');
const webpack = require('webpack');

const config        = require(path.join(__dirname, './app/config'));
const LolstackApp   = require(path.join(__dirname, './app/app'));
const webpackConfig = require(path.join(__dirname, './webpack.config.dev'));

const app      = express();
const compiler = webpack(webpackConfig);
const db       = config.models.db;
const r        = config.models.r;

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(LolstackApp);

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
