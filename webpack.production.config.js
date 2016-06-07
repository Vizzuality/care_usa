'use strict';

const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const postcssMixins = require('postcss-mixins');
const postcssExtend = require('postcss-extend');
const postcssSimpleVars = require('postcss-simple-vars');
const postcssNested = require('postcss-nested');
const postcssImporter = require('postcss-import');
const postcssFunctions = require('postcss-functions');
const postcssHexRgba = require('postcss-hexrgba');

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
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.DefinePlugin({
    ENVIRONMENT: JSON.stringify(process.env.NODE_ENV || 'development'),
    VERSION: JSON.stringify(require('./package.json').version),
    config: JSON.stringify({
      apiUrl: process.env.API_URL,
      cartodbAccount: process.env.CARTODB_ACCOUNT,
      cartodbKey: process.env.CARTODB_KEY,
      mapboxToken: process.env.MAPBOX_TOKEN,
      nokiaAppId: process.env.NOKIA_APP_ID,
      nokiaAppCode: process.env.NOKIA_APP_CODE,
      mapboxStyle: process.env.MAPBOX_STYLE
    })
  })
];

const config = {

  context: path.join(__dirname, 'src'),

  entry: [
    './index.html',
    './anniversary.html',
    './main.js',
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },

  module: {
    loaders: [
      {test: /\.html$/, loader: 'file?name=[name].[ext]'},
      {test: /\.(js|jsx)$/, loader: 'babel-loader', exclude: /node_modules/},
      {test: /\.(postcss$|css$)/, loader: 'style-loader!css-loader!postcss-loader'},
      {test: /\.(png|jpg|gif|svg)$/, loader: 'url-loader?prefix=image/&limit=5000&context=./src/images'},
      {test: /\.(eot|ttf|woff2|woff)$/, loader: 'url-loader?prefix=fonts/&context=./src/fonts'}
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  plugins: prodPlugins,

  postcss: (webpack) => [
    postcssImporter({ addDependencyTo: webpack }),
    autoprefixer,
    postcssMixins,
    postcssExtend,
    postcssSimpleVars,
    postcssNested,
    postcssFunctions({
      functions: {
        rem: (px) => (px / 16) + 'rem'
      }
    }),
    postcssHexRgba
  ]

};

module.exports = config;
