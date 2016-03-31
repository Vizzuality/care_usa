'use strict';

import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import path from 'path';

const prodPlugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      dead_code: true,
      drop_debugger: true,
      drop_console: true
    },
    comments: false
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurrenceOrderPlugin()
];

const config = {

  context: path.join(__dirname, 'src'),

  entry: [
    'webpack/hot/only-dev-server',
    './index.html',
    './app.js'
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {test: /\.html$/, loader: 'file?name=[name].[ext]'},
      {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
      {test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader'},
      {test: /\.(png|jpg|gif)$/, loader: 'url-loader?prefix=image/&limit=5000&context=./src/images'}
    ]
  },

  plugins: process.env.NODE_ENV === 'production' ? prodPlugins : [],

  postcss: () => [autoprefixer]

};

export default config;
