'use strict';

import './styles.postcss';
import _ from 'underscore';
import Backbone from 'backbone';
import TileLayer from './layers/TileLayer';
import TorqueLayer from './layers/TorqueLayer';
import SVGLayer from './layers/SVGLayer';
import ClusterLayer from './layers/ClusterLayer';
import MyDonationMarker from './MyDonationMarker';
import layersCollection from '../../scripts/collections/layersCollection';
import filtersModel from '../../scripts/models/filtersModel';
import utils from '../../scripts/helpers/utils';
import moment from 'moment';


class MapView extends Backbone.View {

  initialize(settings) {
    // First configure mapbox
    L.mapbox.accessToken = config.mapboxToken;

    // Setting default options
    this.options = _.extend({}, this.defaults, settings.options);

    //Checking for device
    this.device = utils.checkDevice();

    // Setting first state
    this.state = new Backbone.Model(settings.state);
    this.state.attributes = _.extend({}, this.options, this.state.attributes);
    this.state.set({ 'filters': filtersModel.toJSON() }, { silent: true });
    this._checkMapInitialSettings();

    this.timestamp = +(new Date());
    this._createMap();
    this._addLayer();
    this._setEvents();
  }

  _checkMapInitialSettings() {
    if (this.device.mobile || this.device.tablet) {
      this.state.attributes.zoom = 2;
    }

    // mobile
    if (this.device.mobile) {
      if(this.state.attributes.mode === 'projects') {
        this.state.attributes.lat = 3.8642546157214213;
        this.state.attributes.lng = -25.3125;
      }
      else {
        this.state.attributes.lat = 7;
        this.state.attributes.lng = -98;
      }

    }

    // Ipad landscape
    if ( !this.device.tablet && this.device.device ) {
      if(this.state.attributes.mode === 'projects') {
        this.state.attributes.lat = 3.8642546157214213;
        this.state.attributes.lng = -25.3125;
      }
      else {
        this.state.attributes.lat = 40;
        this.state.attributes.lng = -120;
      }
    }
  }

  /**
   * Enable the donation marker on the map
   * @param  {String} data the unique identifier of the donation
   */
  enableMyDonationMarker(donationId) {
    this.myDonationMarker = new MyDonationMarker(donationId, this.state.get('layer').slug, this.map);
  }

  /**
   * Update the visibility of the donation marker depending on the layer
   */
  updateMyDonationMakerVisibility() {
    if(!this.myDonationMarker) return;
    this.myDonationMarker.updateVisibility(this.state.get('layer').slug);
  }

  _createMap() {
    const southWest = L.latLng(-80, 124),
        northEast = L.latLng(80, -124),
        bounds = L.latLngBounds(southWest, northEast);

    const mapOptions = {
      zoom: this.state.attributes.zoom,
      center: [this.state.attributes.lat, this.state.attributes.lng],
      scrollWheelZoom: false,
      // minZoom: 2,
      // maxBounds: bounds,
      tileLayer: {
        continuousWorld: false,
        noWrap: true,
      }
    };
    this.map = L.mapbox.map(this.el, this.options.style, mapOptions);

    /* Needed for the initialization of the SVG layer */
    this.state.set({ bounds: this.map.getBounds() });

    this._addAttributions();
  }

  _addAttributions() {
    // Add attribution to Mapbox and OpenStreetMap.
    let attribution = L.control.attribution();
    attribution.setPrefix('');
    attribution.addAttribution('<a href="https://www.mapbox.com/about/maps">© Mapbox</a> <a href="http://openstreetmap.org/copyright"> | © OpenStreetMap</a><a href="https://cartodb.com/attributions/"> | © CartoDB</a>');
    attribution.addTo(this.map);
  }

  _setEvents() {
    this.map.on('click', this.onMapClick.bind(this));

    this.state.on('change:filters', () => this.updateLayer());
    this.state.on('change:timelineDate', () => this.updateLayer());
    this.state.on('change:layer', () => this.updateMyDonationMakerVisibility());

    this.state.on('change:mode', _.bind(this.updateLayer, this));
    layersCollection.on('change', _.bind(this.updateLayer, this));
    filtersModel.on('change', _.bind(this._updateFilters, this));

    this.map.on('zoomend', _.bind(this.onZoomMap, this));
    this.map.on('dragend', _.bind(this.onDragEndMap, this));
  }

  /**
   * Return true if the layer should be reloaded due to changes in the app
   * @return {Boolean} true if should be reloaded, false otherwise
   */
  shouldLayerReload() {
    if(!this.currentLayer) return false;

    /* The timestamp is used to determine if the filters changed */
    if(!this.filtersTimestamp) this.filtersTimestamp = +(new Date());

    const oldState = this.state.previousAttributes();
    oldState.filters.timestamp = this.filtersTimestamp;
    const state = this.state.toJSON();
    state.filters.timestamp = filtersModel._timestamp;

    this.filtersTimestamp = filtersModel._timestamp;

    return this.currentLayer.shouldLayerReload(oldState, state);
  }

  /**
   * Remove the current layer from the map
   */
  removeCurrentLayer() {
    if(!this.currentLayer) return;

    this.currentLayer.closePopup();
    this.map.removeLayer(this.currentLayer.layer);
    this.currentLayer = null;
  }

  /**
   * Add a new layer to the map
   */
  addNewLayer() {
    /* TODO */
    this._addLayer();
  }

  onZoomMap() {
    const oldZoom = this.state.get('zoom');
    const zoom    = this.map.getZoom();
    this.state.set({ zoom });

    if(this.shouldLayerReload()) {
      this.removeCurrentLayer();
      this.addNewLayer();
    }
  }

  onDragEndMap() {
    /* We update the map's state */
    const position = this.map.getCenter();
    this.state.set({
      lat: position.lat,
      lng: position.lng,
      bounds: this.map.getBounds()
    });

    if(this.shouldLayerReload()) {
      this.removeCurrentLayer();
      this.addNewLayer();
    }
  }

  _updateFilters() {
    this.state.set({'filters': filtersModel.toJSON()});
  }

  onMapClick(e) {
    if(!this.currentLayer) return;

    this.currentLayer.onMapClick(this.map, [e.latlng.lat, e.latlng.lng],
      this.map.getZoom(), this.state.get('timelineDate'),
      this.state.get('layer').slug);
  }

  _setFilters() {
    if ( !(filtersModel.filtersIsEmpty()) ) {
      this.options.filters = filtersModel.toJSON();
    } else {
      this.options.filters = null;
    }
  }

  _addLayer() {
    let activeLayer = layersCollection.getActiveLayer(this.state.get('mode'));
    if(!activeLayer) return;

    const state = this.state.toJSON();

    /* We make sure that we don't ask for data outside the domain */
    //Lets don't do it when we have applied some filters. If we are filtering and we set 2011, with this option, we will see data from 2012 into the map. And that is not what we want.
    //We should allow users to see data (or no-data in this case) when dragging the timeline around.
    if (!this.state.attributes.filters.to) {
      if(state.timelineDate && state.layer) {
        const domain = state.layer.domain.map(date => moment.utc(date, 'YYYY-MM-DD').toDate());
        if(+state.timelineDate < +domain[0]) state.timelineDate = domain[0];
        if(+state.timelineDate > +domain[1]) state.timelineDate = domain[1];
      } else if(state.layer) { // ensure there's an initial timelineDate
        const domain = state.layer.domain.map(date => moment.utc(date, 'YYYY-MM-DD').toDate());
        state.timelineDate = domain[1];
      }
    }

    const layerConfig = activeLayer.attributes;
    let layerClass;
    switch(layerConfig.layer_type) {
      case 'torque':
        layerClass = TorqueLayer;
        break;

      case 'svg':
        layerClass = SVGLayer;
        break;

      case 'cluster':
        layerClass = ClusterLayer;
        break;

      default:
        layerClass = TileLayer;
    }

    const newLayer = new layerClass(layerConfig, state, this.map);

    newLayer.initLayer().done(() => {
      /* We ensure to always display the latest tiles */
      if((!this.currentLayer ||
        newLayer.timestamp > this.currentLayer.timestamp) &&
        newLayer.timestamp > this.timestamp) {
        newLayer.layer.addTo(this.map);
        this.currentLayer = newLayer;
        this.currentLayerConfig = layerConfig;
      }
    });
  }

};

MapView.prototype.updateLayer = (function() {
  /* We can't use throttle here because we wanna be sure that the last call is
   * going to be painted */
  const _addLayer = _.debounce(function() {
    this.timestamp = +(new Date());
    this.removeCurrentLayer();
    this._addLayer();
  }, 100);

  return function() {

    const activeLayer = layersCollection.getActiveLayer(this.state.get('mode'));
    if(!activeLayer) return;

    if(this.currentLayerConfig &&
      activeLayer.get('layer_type') !== this.currentLayerConfig.layer_type) {
      _addLayer.call(this);
    } else if(this.shouldLayerReload()) {
      _addLayer.call(this);
    } else if(this.currentLayer) {
      this.currentLayer.updateLayer(this.state.toJSON());
    }

  };

})();

MapView.prototype.defaults = {
  style: config.mapboxStyle,
  lat: 35,
  lng: -80,
  zoom: 3
};

export default MapView;
