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
const envVariables = require('dotenv').config();

const config = {

  context: path.join(__dirname, 'src'),

  entry: [
    'webpack-hot-middleware/client?reload=true',
    './index.html',
    './my-donation.html',
    './anniversary.html',
    './main.js',
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },

  devtool: 'source-map',

  module: {
    loaders: [
      {test: /\.(html|ico)$/, loader: 'file?name=[name].[ext]'},
      {test: /\.(js|jsx)$/, loader: 'babel-loader', exclude: /node_modules/},
      {test: /\.(postcss$|css$)/, loader: 'style-loader!css-loader!postcss-loader'},
      {test: /\.(png|jpg|gif|svg)$/, loader: 'url-loader?prefix=image/&limit=5000&context=./src/images'},
      {test: /\.(eot|ttf|woff2|woff)$/, loader: 'url-loader?prefix=fonts/&context=./src/fonts'}
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify(process.env.NODE_ENV || 'development'),
      VERSION: JSON.stringify(require('./package.json').version),
      config: JSON.stringify({
        apiUrl: envVariables.API_URL,
        cartodbAccount: envVariables.CARTODB_ACCOUNT,
        cartodbKey: envVariables.CARTODB_KEY,
        mapboxToken: envVariables.MAPBOX_TOKEN,
        nokiaAppId: envVariables.NOKIA_APP_ID,
        nokiaAppCode: envVariables.NOKIA_APP_CODE,
        mapboxStyle: envVariables.MAPBOX_STYLE
      })
    })
  ],

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
