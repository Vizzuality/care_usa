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
import ModalDonors from '../ModalDonors';
import Landing from '../Landing';
/* utils should always be called here because of the polyfill for
 * Object.assign */
import utils from '../../scripts/helpers/utils';
import ModalShare from '../ModalShare';
import layersCollection from '../../scripts/collections/layersCollection';
import filtersModel from '../../scripts/models/filtersModel';
import DonorsModalModel from '../../scripts/models/DonorsModalModel';

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
      mode: 'donations',
      layer: 'amount-of-money',
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
          unit: d3.time.week.utc,
          count: 2
        },
        projects: {
          unit: d3.time.year.utc,
          count: 1
        }
      },
      /* The range selected in the timeline */
      timelineDates: {},
      shareOpen: false,
      aboutOpen: false,
      donorsOpen: false,
      /* The range displayed on the map */
      mapDates: {},
      embed: false
    };

  }

  componentWillMount() {

    /* Needs to be done before the component is mounted and before the router
     * is instanciated */
    filtersModel.on('change', () => {
      this.setState({ filters: filtersModel.toJSON() });
      this.router.update(this.parseFiltersForRouter());
    });

    this.router = new Router();
    this.router.params.on('change', this.onRouterChange.bind(this));
    this.router.start();

    this.setState(utils.checkDevice());

    sectorsCollection.fetch()
      .done(() => this.setState({ sectors: sectorsCollection.toJSON() }));
    regionsCollection.fetch()
      .done(() => this.setState({ regions: regionsCollection.toJSON() }));

    this._updateRouterParams();
  }

  componentDidMount() {
    this._initData();
    this.initTimeline();
    DonorsModalModel.on('change', () => !DonorsModalModel.get('donorsOpen') ? '' : this.setState({ donorsOpen: true }));
    this.router.params.on('change', this.onRouterChangeMap.bind(this));
  }

  _updateRouterParams() {
    /* Here we update general state with router params and our device check. */
    const newParams = _.extend({}, {
      donation: this.router.params.attributes.donation && true,
      embed: this.router.params.attributes.embed && true,
    }, this.router.params.attributes);
    this.setState(newParams);
  }

  shouldComponentUpdate(nextProps, nextState) {
    /* Basically, here, what we want to do is pass to the timeline the minimum
     * range covering both the range of the donations and of the projects, or
     * the filtering range if exists */
    const wholeRange = [
      new Date(Math.min(this.state.ranges.donations[0], this.state.ranges.projects[0])),
      new Date(Math.max(this.state.ranges.donations[1], this.state.ranges.projects[1]))
    ];

    const interval = this.state.dataInterval[nextState && nextState.mode || this.state.mode];

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
      const date = moment.utc(params.timelineDate, 'YYYY-MM-DD');
      if(date.isValid()) {
        this.timeline.setCursorPosition(date.toDate());
      }
    }

    /* Update the filters */
    const newFiltersModel = {};

    if(params.startDate) {
      const date = moment.utc(params.startDate, 'YYYY-MM-DD');
      if(date.isValid()) {
        newFiltersModel['from-day']   = date.format('D');
        newFiltersModel['from-month'] = date.format('M');
        newFiltersModel['from-year']  = date.format('YYYY');
        newFiltersModel.from          = date.toDate();
      }
    }

    if(params.endDate) {
      const date = moment.utc(params.endDate, 'YYYY-MM-DD');
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

  onRouterChangeMap() {
    const params = this.router.params.toJSON();

    if (params.zoom) {
      this.mapView.state.set({zoom: params.zoom})
    }

    if (params.lat) {
      this.mapView.state.set({lat: params.lat})
    }

    if (params.lng) {
      this.mapView.state.set({lng: params.lng})
    }
  }

  _initData() {
    layersCollection.fetch().done( () => {
      if (this.router.params.attributes.layer) {
        this._updateLayersCollection(this.router.params.attributes.layer);
      }
      const currentMode = this.state.mode;

      /* Absolutely necessary if we want the map to load when the app is loaded
       * without any param */

        this.timeline.changeMode(currentMode,
          this.state.dataInterval[currentMode],
          this.state.ranges[currentMode],
          true); /* We assume that the layer by default is a Torque one */

      this.setState({ 'ready': true });
      this.initMap();
    })
  }

  //GENERAL METHODS
  changePage(page, e) {
    this.setState({ currentPage: page });
  };

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

    if(res.from) res.startDate = moment.utc(res.from).format('YYYY-MM-DD');
    if(res.to)   res.endDate = moment.utc(res.to).format('YYYY-MM-DD');

    if(!res['from-day'] && !res['from-month'] && !res['from-year']) {
      res.startDate = null;
    }

    if(!res['to-day'] && !res['to-month'] && !res['to-year']) {
      res.endDate = null;
    }

    return _.pick(res, 'startDate', 'endDate', 'region', 'sectors');
  }

  // TIMELINE METHODS
  initTimeline() {
    /* We define the domain of the timeline */
    let domain = [
      new Date(Math.min(this.state.ranges.donations[0], this.state.ranges.projects[0])),
      new Date(Math.max(this.state.ranges.donations[1], this.state.ranges.projects[1]))
    ];
    if(this.state.filters.from || this.state.filters.to) {
      domain = [ this.state.filters.from, this.state.filters.to ];
    }

    const timelineParams = {
      el: this.refs.Timeline,
      domain: domain,
      interval: this.state.dataInterval[this.state.mode],
      filters: this.state.filters,
      triggerTimelineDates: this.updateTimelineDates.bind(this),
      triggerMapDates: this.updateMapDates.bind(this),
      ticksAtExtremities: this.state.filters.from || this.state.filters.to
    };

    /* We retrieve the position of the cursor from the URL if exists */
    if(this.router.params.toJSON().timelineDate) {
      const date = moment.utc(this.router.params.toJSON().timelineDate, 'YYYY-MM-DD');
      if(date.isValid()) {
        timelineParams.cursorPosition = date.toDate();
      }
    }

    this.timeline = new TimelineView(timelineParams);
  }

  // MAP METHODS
  initMap() {
    this.router.update({
      mode: this.state.mode,
      layer: this.state.layer
    });

    this.mapView = new MapView({
      el: this.refs.Map,
      state: this.router.params.toJSON(),
      donation: this.state.donation,
      mode: this.state.mode,
    });

    //Donation
    //If unless we have not lat lng, we avoid to use geolocation
    if (this.state.donation) {
      if ( !this.router.params.get('lat')) {
        this.geo = new GeoModel();
        this.updateBBox();
      } else {
        const state = _.extend({}, this.router.params.attributes, {
          position: [this.router.params.attributes.lat, this.router.params.attributes.lng]
        });
        this.mapView.drawDonationMarker(state);
      }
    }

    this.mapView.state.on('change:zoom', () => {
      const mapZoom = this.mapView.state.get('zoom');
      this.router.update({ zoom: mapZoom });
      this.setState({ zoom: mapZoom });
    })

    this.mapView.state.on('change:lat', () => {
      const mapLat = this.mapView.state.get('lat');
      this.router.update({ lat: mapLat });
      this.setState({ lat: mapLat });
    })

    this.mapView.state.on('change:lng', () => {
      const mapLng = this.mapView.state.get('lng');
      this.router.update({ lng: mapLng });
      this.setState({ lng: mapLng });
    })
    this.ZoomControlEmbed();
  }

  updateBBox() {
    $.when(
      this.geo.fetch({
        data: {q: this.router.params.get('city')}
      })
    ).done(() => {
      const nextState = _.extend({}, this.router.params.attributes, {
        bbox: this.geo.attributes.bbox,
        position: this.geo.attributes.position,
      });

      this.setState(nextState);

      this._updateMapWithRouterParams();

      //Here we tell the map to draw donation marker;
      if (nextState.mode === 'donations') {
        this.mapView.drawDonationMarker(nextState);
      }
    });
  }

  _updateMapWithRouterParams() {
    //Fit map to bbox of city.
    if (this.state.donation && this.geo.attributes.bbox) {
      const bbox = [
        [this.geo.attributes.bbox[1], this.geo.attributes.bbox[0]],
        [this.geo.attributes.bbox[3], this.geo.attributes.bbox[2]]
      ];
      this.mapView.map.fitBounds(bbox);
    }
  }

  changeMapMode(mode, e) {
    let activeLayer = layersCollection.filter(model => model.attributes.category === mode && model.attributes.active )[0].attributes.slug;
    this.router.update({mode: mode, layer: activeLayer});
    this.setState({ mode: mode, layer: activeLayer });

    this.timeline.changeMode(mode, this.state.dataInterval[mode], this.state.ranges[mode]);
    this.mapView.state.set({ 'mode': mode, 'layer': activeLayer, 'currentLayer': activeLayer });
  }

  changeLayer(layer, e) {
    this.router.update({layer: layer});
    this.setState({ layer: layer });

    this._updateLayersCollection(layer);
  }

  _updateLayersCollection(layer) {
    // Inactive all layers of the same group
    let cogroupLayers = layersCollection.filter(model => model.attributes.category === this.state.mode);
    _.each(cogroupLayers, (activeLayer) => {
      activeLayer.set('active', false);
    });

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
      timelineDate: moment.utc(dates.to).format('YYYY-MM-DD')
    });
  }

  updateMapDates(dates) {
    this.setState({ mapDates: dates });
    //MAP STATE CHANGE
    if(this.mapView) this.mapView.state.set({ timelineDates: dates });
  }

  setDonationsAsmode() {
    this.setState({ mode: 'donations' });
  }

  resetFilters() {
    filtersModel.clear({ silent: true });
    filtersModel.set(filtersModel.defaults);
  }

  handleModal(state, modal) {
    const obj = {};
    obj[modal] = state === 'open';
    this.setState(obj);
    if (modal === 'donorsOpen') DonorsModalModel.set({donorsOpen: false});
  }

  ZoomControlEmbed() {
    if(this.state.embed) {
      document.getElementsByClassName('leaflet-control-zoom')[0].setAttribute('class', '-embed-element');
    }
  }

  render() {
    const wholeRange = [
      new Date(Math.min(this.state.ranges.donations[0], this.state.ranges.projects[0])),
      new Date(Math.max(this.state.ranges.donations[1], this.state.ranges.projects[1]))
    ];

    const embedClass = this.state.embed ? 'l-app is-embed' : 'l-app';
    const embedElement = this.state.embed ? '-embed-element' : '';

    return (
      <div className={embedClass} >

        <div id="map" className="l-map" ref="Map"></div>

        { !this.state.embed ?
          <button className="btn-share btn-primary l-share" onClick={ () => this.handleModal('open', 'shareOpen') }>
            <svg className="icon icon-share">
              <use xlinkHref="#icon-share"></use>
            </svg>
          </button> : ''}

        <ModalShare
          visible={ this.state.shareOpen }
          onClose={ this.handleModal.bind(this, 'close', 'shareOpen') }
        />

        <Dashboard
          donation={  this.router.params.attributes.donation && true }
          changeModeFn={ this.changeMapMode.bind(this) }
          changeLayerFn={ this.changeLayer.bind(this) }
          currentMode={ this.state.mode }
          currentLayer={ this.state.layer }
          toggleFiltersFn={ this.toggleModalFilter.bind(this) }
          filters={ this.state.filters }
          sectors={ this.state.sectors }
          regions={ this.state.regions }
          dateRange={ this.state.ranges[this.state.mode] }
          timelineDates={ this.state.timelineDates }
        />

        <div id="timeline" className={`l-timeline m-timeline ${embedElement}`} ref="Timeline">
          <svg className="btn js-button">
            <use xlinkHref="#icon-play" className="js-button-icon"></use>
          </svg>
          <div className="svg-container js-svg-container"></div>
        </div> 

        { !this.state.embed ?
          <div id="map-credits" className="l-map-credits">
          <p className="about-label text text-cta" onClick={ () => this.handleModal('open', 'aboutOpen') }>About the data</p>
          <a className="btn-about" onClick={ () => this.handleModal('open', 'aboutOpen') }>
            <svg className="icon icon-info">
              <use xlinkHref="#icon-info"></use>
            </svg>
          </a>
        </div> : ''}

        <ModalAbout
          visible={ this.state.aboutOpen }
          onClose={ this.handleModal.bind(this, 'close', 'aboutOpen') }
        />

        <ModalFilters
          visible={ this.state.filtersOpen }
          onClose={ this.handleModal.bind(this, 'close', 'filtersOpen') }
          onSave={ this.updateFilters.bind(this) }
          range={ wholeRange }
          availableRange={ this.state.ranges[this.state.mode] }
          routerParams={ this.router && this.router.params.toJSON() }
        />

        <ModalNoData
          filters={ this.state.filters }
          filtersOpen ={ this.state.filtersOpen }
          currentMode={ this.state.mode }
          dateRange={ this.state.ranges[this.state.mode] }
          timelineDates={ this.state.timelineDates }
          onChangeFilters={ this.handleModal.bind(this, 'open', 'filtersOpen') }
          onGoBack={ this.setDonationsAsmode.bind(this) }
          onCancel={ this.resetFilters.bind(this) }
        />

        <ModalDonors
          visible= { this.state.donorsOpen }
          onClose= { this.handleModal.bind(this, 'close', 'donorsOpen') }
        />

        { !this.state.embed ?
            <a href="https://my.care.org/site/Donation2;jsessionid=5FED4A2DADFB975A2EDA92B59231B64B.app314a?df_id=20646&mfc_pref=T&20646.donation=form1" rel="noreferrer" target="_blank" id="donate" className="l-donate btn-contrast">
              Donate
            </a> : '' }

        { !sessionStorage.getItem('session') && !this.state.donation ? <Landing /> : '' }
      </div>
    );
  }

}

export default App;
