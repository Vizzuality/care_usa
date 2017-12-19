'use strict';

const port = process.env.PORT || 3000;
const path = require('path');
const express = require('express');
const logger = require('morgan');
const PrettyError = require('pretty-error');
const mapPath = path.join(__dirname, 'build', 'map', 'index.html');

const app = express();

// Webpack middleware
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config.js');

const compiler = webpack(config);

const middleware = webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,
  contentBase: 'src',
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  }
});

app.use(middleware);
app.get('*', function response(req, res) {
  res.write(middleware.fileSystem.readFileSync(mapPath));
  res.end();
});

// Logs
app.use(logger('dev'));

// Error handling
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => {
  console.log(pe.render(err));
  next();
});

middleware.waitUntilValid(() => {
  app.listen(port, '0.0.0.0', (err) => {
    if (err) {
      console.log(err);
    }
    console.info('==> 🌎 Listening on http://0.0.0.0:%s/', port);
  });
});
