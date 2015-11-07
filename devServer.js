'use strict';

require('babel/register');

const debug    = require('debug')('lolstack:devServer');
const express  = require('express');
const path     = require('path');
const webpack  = require('webpack');

const LolstackApp       = require(path.join(__dirname, './app/app'));
const webpackConfig  = require(path.join(__dirname, './webpack.config.dev'));

const app       = express();
const compiler  = webpack(webpackConfig);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(LolstackApp);

app.listen(9000, function(error) {
  if (error) {
    console.log(error);
    return;
  }
  debug('Listening on port http://localhost:9000');
});
