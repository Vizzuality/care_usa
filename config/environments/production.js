'use strict';

const path = require('path');
const express = require('express');
const indexPath = path.join(process.cwd(), 'dist/index.html');

module.exports = function(app) {
  app.use(express.static(process.cwd() + '/dist'));
  app.get('*', function response(req, res) {
    res.sendFile(indexPath);
  });
};
