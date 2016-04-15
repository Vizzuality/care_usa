'use strict';

import React  from 'react';
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
    this.setState(utils.checkDevice());
    this.router = new Router();
    Backbone.history.start({ pushState: false });
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

  changeMap(map, e) {
    this.setState({ currentMap: map });
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
    return (
      <div className="l-app">

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
      </div>
    );
  }

}

export default App;
