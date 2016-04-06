'use strict';

import 'normalize.css';
import './app.postcss';
import React  from 'react';
import ReactDOM from 'react-dom';

import MainMenu from './components/MainMenu';
import MenuDevice from './components/MenuDevice';
import Infowindow from './components/Infowindow';

import MapView from './scripts/views/MapView.js';

import utils from './scripts/helpers/utils.js'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentTab: 'who-cares',
      device: null,
      menuDeviceOpen: false,
      infowindowVisibility: true,
      infowindowPosition: { top: '50%', left: '50%' }
    }
  }

  componentWillMount() {
    this.setState(utils.checkDevice());
  }

  componentDidMount() {
    this.map = new MapView({ 
      mapElement: this.refs.Map,
      infowindowOpenFn: this.infowindowOpen
    });

  }

  toggleMenu() {
    this.setState({ menuDeviceOpen: !this.state.menuDeviceOpen });
  }

  changeTab(tab, e) {
    this.setState({ currentTab: tab });
  }

  infowindowClose() {
    this.setState({ infowindowVisibility: false });
  }

  infowindowOpen(position) {
    this.setState({ infowindowVisibility: true, infowindowPosition: position });
  }

  render() {
    let menuDevice = null;
    let infoWindow = null;

    if (this.state.mobile) {
      menuDevice = (
        <MenuDevice
          deviceMenuOpen = { this.state.menuDeviceOpen }
          toggleMenuFn = { this.toggleMenu.bind(this) }
        />
      );
    }

    if (this.state.infowindowVisibility) {
      infoWindow = (
        <Infowindow
          position = { !this.state.mobile ? this.state.infowindowPosition : null }
          closeFn = { this.infowindowClose.bind(this) }
        />
      )
    }

    return (
      <div className="l-app">
        <div id="header" className="l-header">
          <div className="wrap">
            <a href="/" className="logo">
              <svg className="icon icon-logo"><use xlinkHref="#icon-logo"></use></svg>
            </a>
            <MainMenu
              currentTab = { this.state.currentTab }
              toggleMenuFn = { this.toggleMenu.bind(this) }
              changeTabFn = { this.changeTab.bind(this) }
            />
          </div>
        </div>

        <div id="map" className="l-map" ref="Map"></div>

        <div id="dashboard" className="l-dashboard"></div>
        <div id="timeline" className="l-timeline"></div>
        <div id="donate" className="l-donate">
          <button className="btn -secondary"></button>
        </div>

        { menuDevice }
        { infoWindow }
      </div>
    );
  }

}

ReactDOM.render(<App />, document.getElementById('app'));
