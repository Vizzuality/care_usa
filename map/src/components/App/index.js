'use strict';

import React  from 'react';
import $ from 'jquery';
import d3  from 'd3';
import _ from 'underscore';
import moment from 'moment';
import Header from '../Header';
import TimelineView from '../Timeline';
import Dashboard from '../Dashboard';
import ModalFilters from '../ModalFilters';
import ModalAbout from '../ModalAbout';
import Anniversary from '../Anniversary';
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
      ready: false,
      mode: 'projects',
      currentPage: 'who-cares',
      device: null,
      menuDeviceOpen: false,
      filtersOpen: false,
      modalNoDataOpen: true,
      filters: {},
      sectors: [],
      regions: [],
      shareOpen: false,
      aboutOpen: false,
      careHistory: false,
      donorsOpen: false,
      embed: false
    };
  }

  componentWillMount() {
    this.setState(utils.checkDevice());

    sectorsCollection.fetch()
      .done(() => this.setState({ sectors: sectorsCollection.toJSON() }));
    regionsCollection.fetch()
      .done(() => this.setState({ regions: regionsCollection.toJSON() }));
  }

  componentDidMount() {
    this._initData();
    DonorsModalModel.on('change', () => !DonorsModalModel.get('donorsOpen') ? '' : this.setState({ donorsOpen: true }));
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.careHistory !== this.state.careHistory) {
      let careHistory = nextProps.careHistory;
      if(!nextProps.careHistory) careHistory = false;
      this.setState({ careHistory });
      if(careHistory) {
        this.router.update({ careHistory });
      }
      else {
        this.router.removeParams('careHistory');
      }
    }
  }

  _updateRouterParams() {
    /* TODO: we shouldn't put all the params in the state: some of them aren't
     * needed because are stored in models, and other need to be parsed */
    /* Here we update general state with router params and our device check. */
    /* To get to the my donation page we are now using the param: g ; instead
    *  of gift or gift_id. This is the identification of the donation on
    *  Carto DB*/
    let newParams = Object.assign({},
      this.router.params.attributes,
      {
        donation: this.router.params.attributes.g || false,
        embed: !!this.router.params.attributes.embed
      });

    if(newParams.careHistory) {
      if(newParams.careHistory !== 'true') {
        const keys = Object.keys(newParams).filter(key => key !== 'careHistory');
        let auxParams = {};
        keys.map(key => auxParams[key] = newParams[key]);
        newParams = auxParams;
        this.router.removeParams('careHistory');
      }
      else {
        const careHistory = true;
        newParams.careHistory = careHistory;
        this.props.toggleHistory(careHistory, false);
      }
    }

    if(newParams.layer) {
      const layer = layersCollection.findWhere({ slug: newParams.layer });
      newParams.layer = layer && layer.toJSON();
    } else if (this.router.params.attributes.g) {
      newParams.layer = layersCollection.getActiveLayer('donations').toJSON();
      newParams.mode = 'donations';
    } else {
      newParams.layer = layersCollection.getActiveLayer(newParams.mode || this.state.mode).toJSON();
    }


    /* The sectors are saved in the filters model */
    delete newParams.sectors;

    this.setState(newParams);
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

    /* Update the state of the map */
    const newMapState = {};
    if (params.zoom) newMapState.zoom = params.zoom;
    if (params.lat) newMapState.lat = params.lat;
    if (params.lng) newMapState.lng = params.lng;
    this.mapView.state.set(newMapState);

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

  _initData() {
    layersCollection.fetch()
      .done(() => {
        /* Needs to be done before the router is instanciated */
        filtersModel.on('change', () => {
          this.setState({ filters: filtersModel.toJSON() });
          if(this.timeline) this.updateTimeline(this.state.layer);
          this.router.update(this.parseFiltersForRouter());
        });

        this.router = new Router();
        this.router.start();
        this._updateRouterParams();
        this.router.params.on('change', this.onRouterChange.bind(this));

        const mode = this.router.params.attributes.mode || this.state.mode;
        const layerSlug = this.router.params.attributes.layer;
        if(layerSlug) layersCollection.setActiveLayer(mode, layerSlug);
        const layer = layersCollection.getActiveLayer(mode)

        this.setState({
          ready: true,
          layer: layer ? layer.toJSON() : ''
        });

        /* InitTimeline should be called before to trigger the current date */
        /* Stories doesn't need a timeline */
        if (this.state.layer.slug !== 'stories') this.initTimeline();
        this.initMap();
      });
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
    const layer = layersCollection.getActiveLayer(this.state.mode).toJSON();
    const cursor = { speed: layer.timeline.speed };
    const interval = Object.assign({}, layer.timeline.interval);
    interval.unit = d3.time[interval.unit];
    interval.period = layer.timeline.interval.unit;

    let domain = layer.domain.map(date => moment.utc(date).toDate());
    let filters = filtersModel.toJSON();
    if(filters.from && filters.to) {
      domain = [ filters.from, filters.to ];
    }

    const timelineParams = {
      el: this.refs.Timeline,
      wholeDomain: layersCollection.getDataDomain(),
      domain,
      cursor,
      interval,
      triggerDate: this.updateTimelineDate.bind(this),
      ticksAtExtremities: filters.from || filters.to,
      layerName: layer.name
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

  /* Update the timeline to reflect the attributes of the new layer and the
   * filters */
  updateTimeline(layer) {
    /* Stories doesn't need a timeline */
    if (this.state.layer.slug !== 'stories') {
      if (!this.timeline) this.initTimeline();
      const cursor = { speed: layer.timeline.speed };
      const interval = Object.assign({}, layer.timeline.interval);
      interval.unit = d3.time[interval.unit];
      interval.period = layer.timeline.interval.unit;

      let domain = layer.domain.map(date => moment.utc(date).toDate());
      let filters = filtersModel.toJSON();
      if(filters.from && filters.to) {
        domain = [ filters.from, filters.to ];
      }

      this.timeline.options.domain = domain;
      this.timeline.options.cursor = cursor;
      this.timeline.options.interval = interval;
      this.timeline.options.ticksAtExtremities = filters.from || filters.to;
      this.timeline.options.layerName = layer.name;
      this.timeline.options.cursorPosition = filters.to !== undefined ? filters.to : moment.utc(layer.domain[1]).toDate();

      this.timeline.render();
    } else if (this.timeline) {
      this.timeline.hide();
    }
  }

  /* This method is called when the timeline triggers the new current date */
  updateTimelineDate(date) {
    this.setState({ timelineDate: date });
    this.router.update({ timelineDate: moment.utc(+date).format('YYYY-MM-DD') });
    if(this.mapView) this.mapView.state.set({ timelineDate: date });
  }

  // MAP METHODS
  initMap() {
    /* We assume that the state already took into account the params from the
     * router. By doing that line, we ensure we have default values in the URL.
     */
    this.router.update({
      mode: this.state.mode,
      layer: this.state.layer.slug
    });


    const state = this.router.params.toJSON();
    state.timelineDate = moment.utc(this.state.timelineDate || this.state.layer.end_date, 'YYYY-MM-DD').toDate();
    state.layer = this.state.layer;
    state.mode = this.state.mode;

    this.mapView = new MapView({
      el: this.refs.Map,
      state,
      mode: this.state.mode
    });

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

    if (this.state.donation) {
      this.mapView.enableMyDonationMarker(this.state.donation);
    }
  }

  changeMapMode(mode) {
    const layer = layersCollection.getActiveLayer(mode);
    if (layer) {
      /* Google Analytics */
      if (ga && ENVIRONMENT === 'production') {
        ga('send', 'event', 'Map', 'Toggle', layer.toJSON().name);
      }

      this.router.update({ mode: mode, layer: layer.toJSON().slug });
      this.setState({ mode: mode, layer: layer.toJSON() }, () => {

        /* We should always update the map before the timeline */
        this.mapView.state.set({
          mode,
          layer: layer.toJSON(),
          currentLayer: layer.toJSON().slug,
        });

        if (this.state.mode === 'donations') {
          const mapDefaultView = {lat: 0, lng: 0, zoom: 3};
          this.mapView.map.setView(new L.LatLng(mapDefaultView.lat, mapDefaultView.lng), mapDefaultView.zoom);
          this.router.update({ lat: mapDefaultView.lat, lng: mapDefaultView.lng, zoom: mapDefaultView.zoom });
        } else if (this.state.mode === 'stories') {
          const mapDefaultView = {lat: 5.35, lng: 18.98, zoom: 3};
          this.mapView.map.setView(new L.LatLng(mapDefaultView.lat, mapDefaultView.lng), mapDefaultView.zoom);
          this.router.update({ lat: mapDefaultView.lat, lng: mapDefaultView.lng, zoom: mapDefaultView.zoom });
        } else {
          const mapDefaultView = {lat: 33, lng: -108, zoom: 3};
          this.mapView.map.setView(new L.LatLng(mapDefaultView.lat, mapDefaultView.lng), mapDefaultView.zoom);
          this.router.update({ lat: mapDefaultView.lat, lng: mapDefaultView.lng, zoom: mapDefaultView.zoom });
        }
        this.updateTimeline(layer.toJSON());
      });

      /* Stops timeline when changing tabs*/
      if (this.timeline) this.timeline.stop();
    }
  }

  changeLayer(layer) {
    this.router.update({ layer: layer.slug });
    this.setState({ layer });
    layersCollection.setActiveLayer(this.state.mode, layer.slug);
    this.mapView.state.set({ layer });
    this.updateTimeline(layer);
  }

  toggleModalFilter() {
    if(!this.state.filtersOpen) {
      /* Stops timeline when opening filters */
      if (this.timeline) this.timeline.stop();
    }

    this.setState({ filtersOpen: !this.state.filtersOpen });
  }

  setDonationsAsmode() {
    this.changeMapMode('donations');
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

  handleLanding() {
    this.state.donation && utils.storage && !localStorage.getItem('session') &&
      localStorage.setItem('session', true);
  }

  handleCloseHistory() {
    const careHistory = false;
    const toggleMenu = false;
    this.handleModal.bind(this, 'close', 'careHistory');
    this.props.toggleHistory(careHistory, toggleMenu);
  }

  render() {
    let content = '';

    this.handleLanding();

    if(this.state.ready) {
      content = <div>

        <Header
          currentTab = { this.props.currentTab }
          toggleMenuFn = { this.props.toggleMenuFn }
          changePageFn = { this.props.changePageFn }
          embed = { this.state.embed }
        />

        <div id="map" className="l-map" ref="Map"></div>

        { !this.state.embed &&
          <button className={`btn-share btn-primary l-share ${this.state.mode}`} onClick={ () => this.handleModal('open', 'shareOpen') }>
            <svg className="icon icon-share">
              <use xlinkHref="#icon-share"></use>
            </svg>
          </button>
        }

        { !this.state.embed &&
          this.state.mode === 'donations' &&
            <button className="btn-filters l-filters" onClick={ this.toggleModalFilter.bind(this) }>
              <svg className="icon icon-filters">
                <use xlinkHref="#icon-filters"></use>
              </svg>
            </button>
        }


        { !this.state.embed &&
          <ModalShare
            visible={ this.state.shareOpen }
            onClose={ this.handleModal.bind(this, 'close', 'shareOpen') }
          />
        }

        <Dashboard
          donation={  this.router.params.attributes.donation && true }
          changeModeFn={ this.changeMapMode.bind(this) }
          changeLayerFn={ this.changeLayer.bind(this) }
          currentMode={ this.state.mode }
          layer={ this.state.layer }
          toggleFiltersFn={ this.toggleModalFilter.bind(this) }
          filters={ this.state.filters }
          sectors={ this.state.sectors }
          regions={ this.state.regions }
          timelineDate={ this.state.timelineDate }
          embed={ this.state.embed }
        />

        <div id="timeline" className="l-timeline m-timeline -hidden" ref="Timeline">
          <div className={`svg-container js-svg-container -${this.state.mode}`}></div>
          <div className="arrow-buttons js-arrow-buttons">
            <svg className="btn arrow-button js-previous-button">
              <path d="M7.501 0L0 9.001 7.501 18l2.98-2.481L5.05 9l5.43-6.517z" fillRule="evenodd" />
            </svg>
            <svg className="btn arrow-button js-next-button">
              <path d="M2.98 0l7.5 9.001L2.98 18 0 15.519 5.43 9 0 2.484z" fillRule="evenodd" />
            </svg>
          </div>
          <svg className="btn play-button js-play-button">
            <use xlinkHref="#icon-play"></use>
          </svg>
        </div>

        { !this.state.embed &&
          <div id="map-credits" className="l-map-credits">
            <div className="care-page-link text text-form-labels -primary" onClick={ () => this.handleModal('open', 'aboutOpen') }>About the data</div>
            <div className="care-page-link text text-form-labels -primary" onClick={ () => this.props.toggleHistory(true) }>Learn About CARE</div>
            <div></div>
          </div>
        }

        { !this.state.embed &&
          <ModalAbout
            visible={ this.state.aboutOpen }
            onClose={ this.handleModal.bind(this, 'close', 'aboutOpen') }
          />
        }

        { !this.state.embed &&
          <Anniversary
            visible={ this.state.careHistory }
            onClose={ () => this.handleCloseHistory() }
            toggleMenuFn = { this.props.toggleMenuFn }
            deviceMenuOpen = { this.props.deviceMenuOpen }
          />
        }

        { !this.state.embed &&
          <ModalFilters
            visible={ this.state.filtersOpen }
            onClose={ this.handleModal.bind(this, 'close', 'filtersOpen') }
            onSave={ () => {} }
            wholeDomain={ layersCollection.getDataDomain() }
            domain={ this.state.layer.domain }
            routerParams={ this.router && this.router.params.toJSON() }
          />
        }

        { !this.state.embed &&
          <ModalNoData
            filters={ this.state.filters }
            filtersOpen ={ this.state.filtersOpen }
            currentMode={ this.state.mode }
            domain={ this.state.layer.domain }
            onChangeFilters={ this.handleModal.bind(this, 'open', 'filtersOpen') }
            onGoBack={ this.setDonationsAsmode.bind(this) }
            onCancel={ this.resetFilters.bind(this) }
          />
        }

        <ModalDonors
          visible= { this.state.donorsOpen }
          onClose= { this.handleModal.bind(this, 'close', 'donorsOpen') }
        />
      </div>;
    }

    return (
      <div className={ 'l-app ' + (this.state.ready ? '' : 'is-loading ') + (this.state.embed ? 'is-embed' : '') }>
        { content }
        { utils.storage && !localStorage.getItem('session') && !this.state.donation && <Landing /> }
      </div>
    );
  }

}

export default App;
