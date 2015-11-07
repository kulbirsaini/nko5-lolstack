'use strict';

const app   = require('./app');
const debug = require('debug')('lolstack:index');

app.listen(9000, function(error) {
  if (error) {
    console.log(error);
    return;
  }
  debug('Listening on port http://localhost:8080');
});
