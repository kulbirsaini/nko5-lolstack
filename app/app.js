'use strict';

const debug = require('debug')('lolstack:app');
const path    = require('path');
const express = require('express');

const app     = express();

//Create a static file server
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/dist', express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  debug(req.originalUrl);
  res.status(200).sendFile(path.join(__dirname, '../public/index.html'));
});

//Get the dummy data
//require('./server/ddata.js');

module.exports = app;
