'use strict';
require('dotenv').config();

const port = process.env.PORT || 5000;
const path = require('path');
const express = require('express');
const router = require('./router');

const mapPath = path.join(__dirname, 'map', 'build');
const storiesPath = path.join(__dirname, 'stories', 'build');

const app = express();
app.get('/', (req, res, next) => {
  if (req.originalUrl.slice(-1) != '/') return next();
  res.redirect('/map')
});

app.use(express.static(mapPath));
app.use(express.static(storiesPath));

app.use('/stories', router);

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on http://0.0.0.0:%s/', port);
});
