'use strict';

import React  from 'react';
import d3  from 'd3';
import TimelineView from '../Timeline';
import Dashboard from '../Dashboard';
import ModalFilters from '../ModalFilters';
import MapView from '../Map';
import Landing from '../Landing';
import Router from '../../scripts/Router';
import utils from '../../scripts/helpers/utils';
import filtersModel from '../../scripts/models/filtersModel';
import sectorsCollection from '../../scripts/collections/sectorsCollection';
import regionsCollection from '../../scripts/collections/regionsCollection';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentMode: 'donations',
      currentLayer: 'amountOfMoney',
      currentPage: 'who-cares',
      device: null,
      menuDeviceOpen: false,
      filtersOpen: false,
      filters: {},
      sectors: [],
      regions: [],
      /* Ranges for which we have data */
      ranges: {
        donations: [ new Date('2011-06-30'), new Date() ],
        projects:  [ new Date('2011-12-30'), new Date() ]
      },
      /* Specify how often we should update the map when playing the timeline
       * or moving the handle. Dates are rounded "nicely" to the interval. */
      dataInterval: {
        donations: {
          unit: d3.time.week,
          count: 2
        },
        projects: {
          unit: d3.time.year,
          count: 1
        }
      }
    }
  }

  componentWillMount() {
    this.setState(utils.checkDevice());
    this.router = new Router();
    Backbone.history.start({ pushState: false });
    sectorsCollection.fetch()
      .done(() => this.setState({ sectors: sectorsCollection.toJSON() }));
    regionsCollection.fetch()
      .done(() => this.setState({ regions: regionsCollection.toJSON() }));
  }

  componentDidMount() {
    this.initMap();
    this.initTimeline();
    filtersModel.on('change', () => this.setState({ filters: filtersModel.toJSON() }));
  }

  shouldComponentUpdate(nextProps, nextState) {
    /* Each time the mode changes, we need to update the timeline's range */
    if(this.state.currentMode !== nextState.currentMode && this.timeline) {
      this.timeline.setRange(this.state.ranges[nextState.currentMode],
        this.state.dataInterval[nextState.currentMode]);
    }

    return true;
  }

  initMap() {
    this.mapView = new MapView({
      el: this.refs.Map,
      currentLayer: this.state.currentLayer,
      state: this.router.params
    });
  }

  initTimeline() {
    this.timeline = new TimelineView({
      el: this.refs.Timeline,
      domain: this.state.ranges[this.state.currentMode],
      interval: this.state.dataInterval[this.state.currentMode]
    });
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

  closeFilterModal() {
    this.setState({ filtersOpen: false });
  }

  toggleModalFilter() {
    this.setState({ filtersOpen: !this.state.filtersOpen });
  }

  updateFilters(filters) {
    this.setState({ filters: filters });
  }

  render() {
    return (
      <div className="l-app">

        <div id="map" className="l-map" ref="Map"></div>

        <button className="btn-share btn-primary l-share">
          <svg className="icon icon-share">
            <use xlinkHref="#icon-share"></use>
          </svg>
        </button>

        <Dashboard
          changeModeFn={ this.changeMapMode.bind(this) }
          changeLayerFn={ this.changeLayer.bind(this) }
          currentMode={ this.state.currentMode }
          currentLayer={ this.state.currentLayer }
          toggleFiltersFn={ this.toggleModalFilter.bind(this) }
          filters={ this.state.filters }
          sectors={ this.state.sectors }
          regions={ this.state.regions }
        />

        <div id="timeline" className="l-timeline m-timeline" ref="Timeline">
          <svg className="btn js-button">
            <use xlinkHref="#icon-play" className="js-button-icon"></use>
          </svg>
          <div className="svg-container js-svg-container"></div>
        </div>

        <div id="map-credits" className="l-map-credits"></div>

        <ModalFilters
          visible={ this.state.filtersOpen }
          onClose={ this.closeFilterModal.bind(this) }
          onSave={ this.updateFilters.bind(this) }
        />

        <a href="http://www.care.org/donate" rel="noreferrer" target="_blank" id="donate" className="l-donate btn-contrast">
          Donate
        </a>

        { !sessionStorage.getItem('session') ? <Landing /> : '' }
      </div>
    );
  }

}

export default App;
