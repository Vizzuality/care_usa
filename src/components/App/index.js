'use strict';

import React  from 'react';
import MainMenu from '../MainMenu';
import MenuDevice from '../MenuDevice';
import TimelineView from '../Timeline';
import InfowindowDonations from '../Infowindow/InfowindowDonations';
import InfowindowProjects from '../Infowindow/InfowindowProjects';
import Dashboard from '../Dashboard';

import MapView from '../Map';

import utils from '../../scripts/helpers/utils';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'who-cares',
      currentMap: 'donations',
      device: null,
      menuDeviceOpen: false,
      infowindowVisibility: false,
      infowindowPosition: {}
    }
  }

  componentWillMount() {
    this.setState(utils.checkDevice());
  }

  componentDidMount() {
    this.map = new MapView({
      mapElement: this.refs.Map,
      currentMap: this.state.currentMap,
      infowindowOpenFn: this.infowindowOpen.bind(this)
    });
    this.timeline = new TimelineView({ el: this.refs.Timeline });
  }

  toggleMenu() {
    this.setState({ menuDeviceOpen: !this.state.menuDeviceOpen });
  }

  changePage(page, e) {
    this.setState({ currentPage: page });
  }

  infowindowClose() {
    this.setState({ infowindowVisibility: false });
  }

  infowindowOpen(position, latLong) {
    this.setState({
      infowindowVisibility: true,
      infowindowPosition: position,
      latLong: latLong
    });
  }

  changeMap(map, e) {
    this.setState({ currentMap: map });
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
      if (this.state.currentMap == 'donations') {
        infoWindow = (
          <InfowindowDonations
            position = { !this.state.mobile ? this.state.infowindowPosition : null }
            latLong = { this.state.latLong }
            currentMap = { this.state.currentMap }
            closeFn = { this.infowindowClose.bind(this) }
          />
        )
      } else {
        infoWindow = (
          <InfowindowProjects
            position = { !this.state.mobile ? this.state.infowindowPosition : null }
            latLong = { this.state.latLong }
            currentMap = { this.state.currentMap }
            closeFn = { this.infowindowClose.bind(this) }
          />
        )
      }
    }

    return (
      <div className="l-app">
        <div id="header" className="l-header">
          <div className="wrap">
            <a href="/" className="logo">
              <img className="icon icon-logo" src={"./src/images/logo.svg"}></img>
            </a>
            <MainMenu
              currentTab = { this.state.currentTab }
              toggleMenuFn = { this.toggleMenu.bind(this) }
              changePageFn = { this.changePage.bind(this) }
            />
          </div>
        </div>

        <div id="map" className="l-map" ref="Map"></div>

        <Dashboard
          changeMapFn={ this.changeMap.bind(this) }
          currentMap={ this.state.currentMap }
        />

        <div id="timeline" className="l-timeline m-timeline" ref="Timeline">
          <svg className="btn js-button">
            <use xlinkHref="#icon-play" className="js-button-icon"></use>
          </svg>
          <div className="svg-container js-svg-container"></div>
        </div>
        <a href="http://www.care.org/donate" rel="noreferrer" target="_blank" id="donate" className="l-donate">
          Donate
        </a>

        { menuDevice }
        { infoWindow }
      </div>
    );
  }

}

export default App;