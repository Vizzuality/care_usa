'use strict';

import 'normalize.css';
import './main.postcss';

import App from './components/App';
import React  from 'react';
import ReactDOM from 'react-dom';

const appElement = document.getElementById('app');

if (appElement) {
  ReactDOM.render(<App />, appElement);
}
