'use strict';

import 'normalize.css';
import './app.postcss';
import React  from 'react';
import ReactDOM from 'react-dom';

import MainMenu from './components/MainMenu';
import MenuDevice from './components/MenuDevice';

import helpers from './helpers.js'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'who-cares',
      device: null,
      menuDeviceOpen: false
    }
  }

  componentWillMount() {
    var device = helpers.checkDevice();
    this.setState(device);
  }

  toggleMenu() {
    this.setState({ 'menuDeviceOpen': ! !!this.state.menuDeviceOpen });
  }

  changeTab(tab, e) {
    this.setState({ 'currentTab': tab });
  }

  render() {
    var menuDevice = this.state.device ? (<MenuDevice 
      deviceMenuOpen= { this.state.menuDeviceOpen }
      toggleMenuFn= { this.toggleMenu.bind(this) }
    />) : null

    return (
      <div className="l-app">
        <div id="header" className="l-header">
          <div className="wrap">
            <a href="/" className="logo">
              <svg className="icon icon-logo"><use xlinkHref="#icon-logo"></use></svg>
            </a>
            <MainMenu 
              currentTab = { this.state.currentTab }
              toggleMenuFn= { this.toggleMenu.bind(this) }
              changeTabFn= { this.changeTab.bind(this) }
            />
          </div>
        </div>

        <div id="map" className="l-map"></div>
        
        <div id="dashboard" className="l-dashboard"></div>
        <div id="timeline" className="l-timeline"></div>
        <div id="donate" className="l-donate">
          <button className="btn -secondary"></button>
        </div>

        { menuDevice }
      </div>
    );
  }
  
}

ReactDOM.render(<App />, document.getElementById('app'));
