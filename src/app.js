'use strict';

import 'normalize.css';
import './app.postcss';
import React from 'react';
import ReactDOM from 'react-dom';

import MainMenu from './components/MainMenu';
import MenuDevice from './components/MenuDevice';

import helpers from './helpers.js'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mobile: null,
      tablet: null,
      device: null
    }
  }

  componentWillMount() {
    var device = helpers.checkDevice();
    this.setState(device);
  }

  render() {

    return (
      <div className="l-app">
        <div id="header" className="l-header">
          <div className="wrap">
            <a href="/" className="logo" src={ "./images/logo.svg" } ></a>
            <MainMenu />
          </div>
        </div>
        <div id="dashboard" className="l-dashboard"></div>
        <div id="map" className="l-map"></div>
        <div id="timeline" className="l-timeline"></div>

        <button className="btn -secondary"></button>
        { this.state.device ? (<MenuDevice />) : null }
      </div>
    );
  }
  
}

ReactDOM.render(<App />, document.getElementById('app'));
