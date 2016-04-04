'use strict';

import 'normalize.css';
import './app.postcss';
import React from 'react';
import ReactDOM from 'react-dom';

import MainMenu from './components/MainMenu';

class App extends React.Component {
  render() {
    return (
      <div className="l-app">
        <div id="header" className="l-header">
          <div className="wrap">
            <a href="/" className="logo"></a>
            <MainMenu />
          </div>
        </div>

        <div id="dashboard" className="l-dashboard"></div>
        <div id="map" className="l-map"></div>
        <div id="timeline" className="l-timeline"></div>
        <button className="btn -secondary"></button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
