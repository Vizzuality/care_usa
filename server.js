'use strict';

const port = process.env.PORT || 5000;
const path = require('path');
const express = require('express');

const mapPath = path.join(process.cwd(), 'map', 'build');
const storiesPath = path.join(process.cwd(), 'stories', 'build');
const app = express();

app.use(express.static(storiesPath));
app.use(express.static(mapPath));

app.get('/map', (req, res) => {
  res.sendFile(path.join(mapPath, 'map/index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(storiesPath, 'index.html'));
});


app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on http://0.0.0.0:%s/', port);
});
