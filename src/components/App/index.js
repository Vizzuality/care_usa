'use strict';

import React  from 'react';
import $ from 'jquery';
import d3  from 'd3';
import _ from 'underscore';
import moment from 'moment';
import TimelineView from '../Timeline';
import Dashboard from '../Dashboard';
import ModalFilters from '../ModalFilters';
import ModalAbout from '../ModalAbout';
import ModalNoData from '../ModalNoData';
import MapView from '../Map';
import Landing from '../Landing';
import utils from '../../scripts/helpers/utils';
import ModalShare from '../ModalShare';
import layersCollection from '../../scripts/collections/layersCollection';
import filtersModel from '../../scripts/models/filtersModel';
import sectorsCollection from '../../scripts/collections/SectorsCollection';
import regionsCollection from '../../scripts/collections/RegionsCollection';

import GeoModel from './GeoModel';

import Router from '../Router';

/**
 * Router definition
 */
// class DonationRouter extends Router {}
// Overriding default routes
Router.prototype.routes = {
  '': function(args) {
    if(args) this.params.set(this.parseParams(args));
    console.info('you are on map page');
  }
};

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
      modalNoDataOpen: true,
      filters: {},
      sectors: [],
      regions: [],
      /* Ranges for which we have data */
      ranges: {
        donations: [ new Date('2011-07-01'), new Date() ],
        projects:  [ new Date('2012-01-01'), new Date('2015-01-01') ]
      },
      /* Specify how often we should update the map when playing the timeline
       * or moving the handle. Dates are rounded "nicely" to the interval. */
      dataInterval: {
        donations: {
          unit: d3.time.month,
          count: 2
        },
        projects: {
          unit: d3.time.year,
          count: 1
        }
      },
      /* The range selected in the timeline */
      timelineDates: {},
      shareOpen: false,
      aboutOpen: false,
      /* The range displayed on the map */
      mapDates: {}
    }
  }

  componentWillMount() {
    this.setState(utils.checkDevice());

    /* Needs to be done before the component is mounted and before the router
     * is instanciated */
    filtersModel.on('change', () => {
      this.setState({ filters: filtersModel.toJSON() });
      this.router.update(this.parseFiltersForRouter());
    });

    this.router = new Router();
    this.router.params.on('change', this.onRouterChange.bind(this));
    this.router.start();

    sectorsCollection.fetch()
      .done(() => this.setState({ sectors: sectorsCollection.toJSON() }));
    regionsCollection.fetch()
      .done(() => this.setState({ regions: regionsCollection.toJSON() }));
  }

  componentDidMount() {
    this._initData();
    this.initTimeline();
  }

  shouldComponentUpdate(nextProps, nextState) {
    /* Basically, here, what we want to do is pass to the timeline the minimum
     * range covering both the range of the donations and of the projects, or
     * the filtering range if exists */
    const wholeRange = [
      new Date(Math.min(this.state.ranges.donations[0], this.state.ranges.projects[0])),
      new Date(Math.max(this.state.ranges.donations[1], this.state.ranges.projects[1]))
    ];

    const interval = this.state.dataInterval[nextState && nextState.currentMode || this.state.currentMode];

    if(nextState.filters.from && nextState.filters.from !== this.state.filters.from ||
      nextState.filters.to && nextState.filters.to !== this.state.filters.to) {
      const range = [ nextState.filters.from, nextState.filters.to ];
      this.timeline.setRange(range, interval, true);
    } else if(this.state.filters.from && !nextState.filters.from ||
      this.state.filters.to && !nextState.filters.to) {
      this.timeline.setRange(wholeRange, interval);
    }

    return true;
  }

  onRouterChange() {
    const params = this.router.params.toJSON();

    /* Update the position of the cursor in the timeline */
    if(this.timeline && params.timelineDate) {
      const date = moment(params.timelineDate, 'YYYY-MM-DD');
      if(date.isValid()) {
        this.timeline.setCursorPosition(date.toDate());
      }
    }

    /* Update the filters */
    const newFiltersModel = {};

    if(params.startDate) {
      const date = moment(params.startDate, 'YYYY-MM-DD');
      if(date.isValid()) {
        newFiltersModel['from-day']   = date.format('D');
        newFiltersModel['from-month'] = date.format('M');
        newFiltersModel['from-year']  = date.format('YYYY');
        newFiltersModel.from          = date.toDate();
      }
    }

    if(params.endDate) {
      const date = moment(params.endDate, 'YYYY-MM-DD');
      if(date.isValid()) {
        newFiltersModel['to-day']   = date.format('D');
        newFiltersModel['to-month'] = date.format('M');
        newFiltersModel['to-year']  = date.format('YYYY');
        newFiltersModel.to          = date.toDate();
      }
    }

    if(params.region) {
      newFiltersModel.region = params.region;
    }

    if(params.sectors && params.sectors.length) {
      newFiltersModel.sectors = params.sectors;
    }

    filtersModel.set(newFiltersModel);
  }

  _initData() {
    layersCollection.fetch().done( () => {
      this.setState({ 'ready': true, currentLayer: 'amount-of-money' });
      this.initMap();
    })
  }

  //GENERAL METHODS
  changePage(page, e) {
    this.setState({ currentPage: page });
  }

  parseFiltersForRouter() {
    var params = filtersModel.toJSON();
    var res = {};

    for(let key in params) {
      const param = params[key];
      if(Array.isArray(param)) {
        if(param.length) res[key] = param;
        else res[key] = null;
      } else if(!Array.isArray(param)) {
        if(param) res[key] = param;
        else res[key] = null;
      }
    }

    if(res.from) res.startDate = moment(res.from).format('YYYY-MM-DD');
    if(res.to)   res.endDate = moment(res.to).format('YYYY-MM-DD');

    return _.pick(res, 'startDate', 'endDate', 'region', 'sectors');
  }

  // TIMELINE METHODS
  initTimeline() {
    const wholeRange = [
      new Date(Math.min(this.state.ranges.donations[0], this.state.ranges.projects[0])),
      new Date(Math.max(this.state.ranges.donations[1], this.state.ranges.projects[1]))
    ];

    const timelineParams = {
      el: this.refs.Timeline,
      domain: wholeRange,
      interval: this.state.dataInterval[this.state.currentMode],
      filters: this.state.filters,
      triggerTimelineDates: this.updateTimelineDates.bind(this),
      triggerMapDates: this.updateMapDates.bind(this),
      ticksAtExtremities: false
    };

    /* We retrieve the position of the cursor from the URL if exists */
    if(this.router.params.toJSON().timelineDate) {
      const date = moment(this.router.params.toJSON().timelineDate, 'YYYY-MM-DD');
      if(date.isValid()) {
        timelineParams.cursorPosition = date.toDate();
      }
    }

    this.timeline = new TimelineView(timelineParams);
  }

  // MAP METHODS
  initMap() {
    this.router.update({
      mode: this.state.currentMode,
      layer: this.state.currentLayer
    });

    this.mapView = new MapView({
      el: this.refs.Map,
      state: this.router.params.toJSON(),
      donation: this.state.donation,
      mode: this.state.currentMode,
    });

    //Donation
    if (this.state.donation) {
      this.geo = new GeoModel();
      this.updateBBox();
      //TODO - activate this to update map. But solve repetition
      // router.params.on('change', this.updateBBox.bind(this));
    }
  }

  changeMapMode(mode, e) {
    this.router.update({mode: mode});
    this.setState({ currentMode: mode });
    //MAP STATE CHANGE CHANGE
    this.mapView.state.set({ 'mode': mode });
    this.timeline.changeMode(mode, this.state.dataInterval[mode], this.state.ranges[mode]);
  }

  changeLayer(layer, e) {
    this.router.update({layer: layer});
    this.setState({ currentLayer: layer });

    // Inactive all layers ofthe same group
    let cogroupLayers = layersCollection.filter(model => model.attributes.category === this.state.currentMode);
    _.each(cogroupLayers, (activeLayer) => {
      activeLayer.set('active', false);
    })

    //Active new layer
    let newLayer = layersCollection.filter(model => model.attributes.slug === layer);
    newLayer[0].set('active', true);
  }

  toggleModalFilter() {
    this.setState({ filtersOpen: !this.state.filtersOpen });
  }

  updateFilters(filters) {
    this.setState({ filters: filters });
  }

  updateTimelineDates(dates) {
    this.setState({ timelineDates: dates });
    this.router.update({
      timelineDate: moment(dates.to).format('YYYY-MM-DD')
    });
  }

  updateMapDates(dates) {
    this.setState({ mapDates: dates });
    //MAP STATE CHANGE
    this.mapView.state.set({ timelineDates: dates });
  }

  setDonationsAsCurrentMode() {
    this.setState({ currentMode: 'donations' });
  }

  resetFilters() {
    filtersModel.clear({ silent: true });
    filtersModel.set(filtersModel.defaults);
  }

  handleModal(state, modal) {
    const obj = {};
    obj[modal] = state === 'open';
    this.setState(obj);
  }

  //DONATION METHODS
  componentDidUpdate() {
    if (this.state.donation && this.state.bbox) {
      const bbox = [
        [this.state.bbox[1], this.state.bbox[0]],
        [this.state.bbox[3], this.state.bbox[2]]
      ];
      this.mapView.map.fitBounds(bbox);
      this.mapView.map.setZoom(this.state.zoom);
      // this.mapView.removeAllLayers();
      // this.mapView.layersSpec.reset(this.state.layersData);
      // this.mapView.layersSpec.instanceLayers();
      // this.mapView.toggleLayers();
    }
  }

  updateBBox() {
    $.when(
      // layersCollection.fetch(),
      this.geo.fetch({
        data: {q: this.router.params.get('city')}
      })
    ).done(() => {
      // const layerModel = layersCollection.find({slug: 'amount-of-money'});
      // const layersData = [{
      //   type: 'marker',
      //   position: this.geo.attributes.position,
      //   title: router.params.attributes.name,
      //   active: true
      // }, {
      //   type: 'cartodb',
      //   active: layerModel.attributes.active,
      //   account: config.cartodbAccount,
      //   sql: layerModel.attributes.geo_query.replace('$WHERE', ''),
      //   cartocss: layerModel.attributes.geo_cartocss
      // }];
      const nextState = _.extend({}, this.router.params.attributes, {
        bbox: this.geo.attributes.bbox,
        position: this.geo.attributes.position,
      });

      this.setState(nextState);

      //Here we tell the map to draw donation marker;
      if (nextState.mode === 'donations') {
        this.mapView.drawDonationMarker(nextState);
      }
    });
  }

  render() {
    const wholeRange = [
      new Date(Math.min(this.state.ranges.donations[0], this.state.ranges.projects[0])),
      new Date(Math.max(this.state.ranges.donations[1], this.state.ranges.projects[1]))
    ];

    return (
      <div className="l-app">

        <div id="map" className="l-map" ref="Map"></div>

        <button className="btn-share btn-primary l-share" onClick={ () => this.handleModal('open', 'shareOpen') }>
          <svg className="icon icon-share">
            <use xlinkHref="#icon-share"></use>
          </svg>
        </button>

        <ModalShare
          visible={ this.state.shareOpen }
          onClose={ this.handleModal.bind(this, 'close', 'shareOpen') }
        />

        <Dashboard
          changeModeFn={ this.changeMapMode.bind(this) }
          changeLayerFn={ this.changeLayer.bind(this) }
          currentMode={ this.state.currentMode }
          currentLayer={ this.state.currentLayer }
          toggleFiltersFn={ this.toggleModalFilter.bind(this) }
          filters={ this.state.filters }
          sectors={ this.state.sectors }
          regions={ this.state.regions }
          dateRange={ this.state.ranges[this.state.currentMode] }
          timelineDates={ this.state.timelineDates }
        />

        <div id="timeline" className="l-timeline m-timeline" ref="Timeline">
          <svg className="btn js-button">
            <use xlinkHref="#icon-play" className="js-button-icon"></use>
          </svg>
          <div className="svg-container js-svg-container"></div>
        </div>

        <div id="map-credits" className="l-map-credits">
          <p className="about-label text text-cta" onClick={ () => this.handleModal('open', 'aboutOpen') }>About the data</p>
          <a className="btn-about" onClick={ () => this.handleModal('open', 'aboutOpen') }>
            <svg className="icon icon-info">
              <use xlinkHref="#icon-info"></use>
            </svg>
          </a>
        </div>

        <ModalAbout
          visible={ this.state.aboutOpen }
          onClose={ this.handleModal.bind(this, 'close', 'aboutOpen') }
        />

        <ModalFilters
          visible={ this.state.filtersOpen }
          onClose={ this.handleModal.bind(this, 'close', 'filtersOpen') }
          onSave={ this.updateFilters.bind(this) }
          range={ wholeRange }
          availableRange={ this.state.ranges[this.state.currentMode] }
          routerParams={ this.router && this.router.params.toJSON() }
        />

        <ModalNoData
          filters={ this.state.filters }
          filtersOpen ={ this.state.filtersOpen }
          currentMode={ this.state.currentMode }
          dateRange={ this.state.ranges[this.state.currentMode] }
          timelineDates={ this.state.timelineDates }
          onChangeFilters={ this.handleModal.bind(this, 'open', 'filtersOpen') }
          onGoBack={ this.setDonationsAsCurrentMode.bind(this) }
          onCancel={ this.resetFilters.bind(this) }
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
