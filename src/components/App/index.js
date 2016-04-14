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
      currentMode: 'donations',
      currentLayer: 'amountOfMoney',
      currentPage: 'who-cares',
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
      currentLayer: this.state.currentLayer,
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

  changeMapMode(mode, e) {
    let sublayer;

    if (mode == 'donations') {
      sublayer = 'amountOfMoney';
    } else {
      sublayer = 'projects';
    }

    this.setState({ currentMode: mode, currentLayer: sublayer });
    this._updateMap(sublayer);
  }

  changeLayer(layer, e) {
    this.setState({ currentLayer: layer });
    this._updateMap(layer);
  }

  _updateMap(layer) {
    this.mapView.state.set({ 'currentLayer': layer });
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
              currentTab = { this.state.currentPage }
              toggleMenuFn = { this.toggleMenu.bind(this) }
              changePageFn = { this.changePage.bind(this) }
            />
          </div>
        </div>

        <div id="map" className="l-map" ref="Map"></div>

        <Dashboard
          changeModeFn={ this.changeMapMode.bind(this) }
          changeLayerFn={ this.changeLayer.bind(this) }
          currentMode={ this.state.currentMode }
          currentLayer={ this.state.currentLayer }
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
