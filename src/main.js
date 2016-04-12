'use strict';

import 'normalize.css';
import './main.postcss';

import Backbone from 'backbone';
import React  from 'react';
import ReactDOM from 'react-dom';
import Router from './scripts/Router';
import App from './components/App';

const appElement = document.getElementById('app');

if (appElement) {
  ReactDOM.render(<App />, appElement);
}

// Initializing router
new Router();
Backbone.history.start({ pushState: false });
