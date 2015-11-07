'use strict';

const path = require('path');
const app   = require('./app');
const debug = require('debug')('lolstack:index');
const config = require(path.join(__dirname, './config'));

app.listen(config.express.port, function(error) {
  if (error) {
    console.log(error);
    return;
  }
  debug('Listening on port http://localhost:' + config.express.port);
});
