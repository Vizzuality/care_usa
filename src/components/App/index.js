'use strict';

import React  from 'react';
import d3  from 'd3';
import _ from 'underscore';
import moment from 'moment';
import TimelineView from '../Timeline';
import Dashboard from '../Dashboard';
import ModalFilters from '../ModalFilters';
import ModalAbout from '../ModalAbout';
import MapView from '../Map';
import Landing from '../Landing';
import utils from '../../scripts/helpers/utils';
import ModalShare from '../ModalShare';
import layersCollection from '../../scripts/collections/layersCollection';
import filtersModel from '../../scripts/models/filtersModel';
import sectorsCollection from '../../scripts/collections/SectorsCollection';
import regionsCollection from '../../scripts/collections/RegionsCollection';

import Router from '../Router';

/**
 * Router definition
 */
class AppRouter extends Router {}
// Overriding default routes
AppRouter.prototype.routes = {
  '': function() {
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
      },
      /* The range selected in the timeline */
      timelineDates: {},
      shareOpen: false,
      aboutOpen: false
    }
  }

  componentWillMount() {
    this.setState(utils.checkDevice());
    this.router = new AppRouter();
    this.router.start();
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

  shouldComponentUpdate(nextProps, nextState) {
    /* Each time the mode changes, we need to update the timeline's range */
    if(this.timeline && (this.state.currentMode !== nextState.currentMode)) {
      this.timeline.setRange(this.state.ranges[nextState.currentMode],
        this.state.dataInterval[nextState.currentMode]);
    }

    /* Each time the user filters the map, we update the timeline to make sure
     * the filter dates match the timeline's domain */
    if(this.timeline && this.state.filters !== nextState.filters) {
      if(nextState.filters.from && nextState.filters.to) {
        this.timeline.setRange([ nextState.filters.from, nextState.filters.to ]);
      } else {
        this.timeline.setRange.call(this.timeline, nextState.ranges[nextState.currentMode]);
      }
    }

    return true;
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

  // TIMELINE METHODS
  initTimeline() {
    const domain = this.state.ranges[this.state.currentMode];
    this.timeline = new TimelineView({
      el: this.refs.Timeline,
      domain: domain,
      interval: this.state.dataInterval[this.state.currentMode],
      filters: this.state.filters,
      onTriggerDates: this.updateTimelineDates.bind(this)
    });
    this.router.update({
      startDate: moment(domain[0]).format('YYYY-MM-DD'),
      endDate: moment(domain[1]).format('YYYY-MM-DD')
    });
  }

  // MAP METHODS
  initMap() {
    this.router.update({
      mode: this.state.currentMode,
      layer: this.state.currentLayer
    });

    this.mapView = new MapView({
      el: this.refs.Map,
      state: _.clone(this.router.params)
    });
  }

  changeMapMode(mode, e) {
    this.router.update({mode: mode});
    this.setState({ currentMode: mode });
    this.mapView.state.set({ 'mode': mode });
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

  updateTimelineDates(dates) {
    this.setState({ timelineDates: dates })
  }

  // SHARE METHODS
  openShareModal() {
    this.setState({ shareOpen: true });
  }

  closeShareModal() {
    this.setState({ shareOpen: false });
  }

  // ABOUT METHODS
  openAboutModal() {
    this.setState({ aboutOpen: true });
  }

  closeAboutModal() {
    this.setState({ aboutOpen: false });
  }

  render() {
    return (
      <div className="l-app">

        <div id="map" className="l-map" ref="Map"></div>

        <button className="btn-share btn-primary l-share" onClick={ () => this.openShareModal() }>
          <svg className="icon icon-share">
            <use xlinkHref="#icon-share"></use>
          </svg>
        </button>

        <ModalShare
          visible={ this.state.shareOpen }
          onClose={ this.closeShareModal.bind(this) }
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

        <div id="map-credits" className="l-map-credits"></div>

        <ModalFilters
          visible={ this.state.filtersOpen }
          onClose={ this.closeFilterModal.bind(this) }
          onSave={ this.updateFilters.bind(this) }
        />

        <a href="http://www.care.org/donate" rel="noreferrer" target="_blank" id="donate" className="l-donate btn-contrast">
          Donate
        </a>

        <ModalAbout
          visible={ this.state.aboutOpen }
          onClose={ this.closeAboutModal.bind(this) }
        />

        { !sessionStorage.getItem('session') ? <Landing /> : '' }
      </div>
    );
  }

}

export default App;
