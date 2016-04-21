'use strict';

import React  from 'react';
import _ from 'underscore';
import TimelineView from '../Timeline';
import Dashboard from '../Dashboard';
import ModalFilters from '../ModalFilters';
import MapView from '../Map';
import Landing from '../Landing';
import Router from '../../scripts/Router';
import utils from '../../scripts/helpers/utils';
import layersCollection from '../../scripts/collections/layersCollection';
import filtersModel from '../../scripts/models/filtersModel';
import sectorsCollection from '../../scripts/collections/sectorsCollection';
import regionsCollection from '../../scripts/collections/regionsCollection';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentMode: 'donations',
      currentLayer: null,
      currentPage: 'who-cares',
      device: null,
      menuDeviceOpen: false,
      filtersOpen: false,
      filters: {},
      sectors: [],
      regions: []
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
    this._initData();
    this.initTimeline();
    filtersModel.on('change', () => this.setState({ filters: filtersModel.toJSON() }));
  }

  _initData() {
     layersCollection.fetch().done( () => {
      this.setState({ 'ready': true, currentLayer: 'amountOfMoney' });
      this.initMap();
    })
  }

  //GENERAL METHODS
  changePage(page, e) {
    this.setState({ currentPage: page });
  }

  // TIMELINE METHODS
  initTimeline() {
    this.timeline = new TimelineView({ el: this.refs.Timeline });
  }

  // MAP METHODS
  initMap() {
    //TODO - Include mapMode into router params
    this.router.params.set('mapMode', this.state.currentMode);

    this.mapView = new MapView({
      el: this.refs.Map,
      state: this.router.params
    });
  }

  changeMapMode(mode, e) {
    this.setState({ currentMode: mode });
    this.mapView.state.set({ 'mapMode': mode });
  }

  changeLayer(layer, e) {
    this.setState({ currentLayer: layer });  

    // Inactive all layers ofthe same group
    let cogroupLayers = layersCollection.filter(model => model.attributes.group === this.state.currentMode);
    _.each(cogroupLayers, (activeLayer) => {
      activeLayer.set('active', false);
    })

    //Active new layer
    let newLayer = layersCollection.filter(model => model.attributes.id === layer);
    newLayer[0].set('active', true);
  }

  // FILTERS METHODS
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
