'use strict';

import React  from 'react';
import MainMenu from '../MainMenu';
import MenuDevice from '../MenuDevice';
import TimelineView from '../Timeline';
import Dashboard from '../Dashboard';
import MapView from '../Map';
import Router from '../../scripts/Router';

import utils from '../../scripts/helpers/utils';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentMap: 'donations',
      device: null,
      menuDeviceOpen: false
    }
  }

  componentWillMount() {
    this.router = new Router();
    Backbone.history.start({ pushState: false });
    this.setState(utils.checkDevice());
  }

  componentDidMount() {
    this.initMap();
    this.initTimeline();
  }

  initMap() {
    this.mapView = new MapView({
      el: this.refs.Map,
      currentMap: this.state.currentMap, // TODO: change name
      state: this.router.params
    });
  }

  initTimeline() {
    this.timeline = new TimelineView({ el: this.refs.Timeline });
  }

  toggleMenu() {
    this.setState({ menuDeviceOpen: !this.state.menuDeviceOpen });
  }

  changePage(page, e) {
    this.setState({ currentPage: page });
  }

  changeMap(map, e) {
    this.setState({ currentMap: map });
  }

  render() {
    let menuDevice = null;

    if (this.state.mobile) {
      menuDevice = (
        <MenuDevice
          deviceMenuOpen = { this.state.menuDeviceOpen }
          toggleMenuFn = { this.toggleMenu.bind(this) }
        />
      );
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
      </div>
    );
  }

}

export default App;
