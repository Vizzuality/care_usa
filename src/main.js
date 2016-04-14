'use strict';

import 'normalize.css';
import './main.postcss';

import React  from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

const appElement = document.getElementById('app');

if (appElement) {
  ReactDOM.render(<App />, appElement);
}
