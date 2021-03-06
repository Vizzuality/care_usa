'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssMixins = require('postcss-mixins');
const postcssExtend = require('postcss-extend');
const postcssSimpleVars = require('postcss-simple-vars');
const postcssNested = require('postcss-nested');
const postcssImporter = require('postcss-import');
const postcssFunctions = require('postcss-functions');
const postcssHexRgba = require('postcss-hexrgba');

process.env.BROWSERSLIST_CONFIG = 'browserslist';
const envVariables = process.env;

const webpackConfig = {

  entry: [
    path.join(__dirname, 'src/main.jsx')
  ],

  output: {
    path: path.join(__dirname, 'build/map/'),
    filename: '[name]-[hash].js',
    publicPath: '/map/'
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify(process.env.NODE_ENV || 'development'),
      VERSION: JSON.stringify(require('./package.json').version),
      config: JSON.stringify({
        apiUrl: envVariables.API_URL,
        cartodbAccount: envVariables.CARTODB_ACCOUNT,
        cartodbKey: envVariables.CARTODB_KEY,
        nokiaAppId: envVariables.NOKIA_APP_ID,
        nokiaAppCode: envVariables.NOKIA_APP_CODE,
        basemap: envVariables.BASEMAP,
        ctoken: envVariables.REACT_APP_CONTENTFUL_TOKEN,
        cspace: envVariables.REACT_APP_SPACE_ID,
      })
    })
  ],

  module: {
    loaders: [
      {test: /\.(js|jsx)?$/, exclude: /node_modules/, loader: 'babel'},
      {test: /\.(postcss$|css$)/, loader: 'style-loader!css-loader!postcss-loader'},
      {test: /\.(png|jpg|gif|svg)$/, loader: 'url-loader?prefix=image/&limit=5000&context=./src/images'},
      {test: /\.(eot|ttf|woff2|woff)$/, loader: 'url-loader?prefix=fonts/&context=./src/fonts'}
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  postcss: (webpack) => [
    postcssImporter({ addDependencyTo: webpack }),
    autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Safari >= 8'] }),
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

// Environment configuration
if (process.env.NODE_ENV === 'production') {
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      dead_code: true,
      drop_debugger: true,
      drop_console: true
    },
    comments: false
  }));
} else {
  webpackConfig.devtool = 'eval-source-map';
}

module.exports = webpackConfig;
