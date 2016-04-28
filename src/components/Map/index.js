'use strict';

import './styles.postcss';
import _ from 'underscore';
import Backbone from 'backbone';
import TileLayer from './TileLayer';
import MarkerLayer from './layers/MarkerLayer';
import TorqueLayer from './TorqueLayer';
import PopUpContentView from './../PopUp/PopUpContentView';
import layersCollection from '../../scripts/collections/layersCollection';
import filtersModel from '../../scripts/models/filtersModel';
import utils from '../../scripts/helpers/utils';


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
    this.state.set({'filters': filtersModel.toJSON()}, {silent: true});
    this._checkMapSettings();

    this._createMap();
    this._addLayer();
    this._setEvents();
  }

  _checkMapSettings() {
    if (this.device.mobile || this.device.tablet) {
      this.state.attributes.zoom = 2;
    }

    // mobile
    if (this.device.mobile) {
      this.state.attributes.lat = 10;
      this.state.attributes.lon = -100;
    }

    // Ipad landscape
    if ( !this.device.tablet && this.device.device ) {
      this.state.attributes.lat = 40;
      this.state.attributes.lon = -120;
    }
  }

  drawDonationMarker(options) {
    this.marker = new MarkerLayer(options);
    this.marker.addLayer(this.map);

    this.myDonationPopUp = new PopUpContentView({
      currentMode: 'my-donation',
      currentLayer: 'my-donation',
      latLng: options.position,
      map: this.map,
      name: options.name
    }).getPopUp();
  }

  _createMap() {
    const mapOptions = {
      zoom: this.state.attributes.zoom,
      center: [this.state.attributes.lat, this.state.attributes.lon]
    };
    this.map = L.mapbox.map(this.el, this.options.style, mapOptions);

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
    this.map.on('click', this._infowindowSetUp.bind(this));

    this.state.on('change:zoom', () => {
      this.map.setZoom(this.state.attributes.zoom);
    });

    this.state.on('change:lat', () => {
      const center = this.map.getCenter();
      const latlng = L.latLng(this.state.attributes.lat, center.lng);
      this.map.setView(latlng, this.map.getZoom());
    });

    this.state.on('change:lon', () => {
      const center = this.map.getCenter();
      const latlng = L.latLng(center.lat, this.state.attributes.lon);
      this.map.setView(latlng, this.map.getZoom());
    });

    this.state.on('change:filters', () => this.changeLayer());
    this.state.on('change:timelineDates', () => this.changeLayerTimeline());

    this.state.on('change:mode', _.bind(this.changeLayer, this));
    layersCollection.on('change', _.bind(this.changeLayer, this));
    filtersModel.on('change', _.bind(this._updateFilters, this));

    this.map.on('zoomend', _.bind(this._setStateZoom, this));
  }

  _setStateZoom(e) {
    const zoom = this.map.getZoom();
    this.state.set({zoom: this.map.getZoom()}, {silent: true});
  }

  _updateFilters() {
    this.state.set({'filters': filtersModel.toJSON()});
  }

  _infowindowSetUp(e) {
    this.popUp = new PopUpContentView({
      currentMode: this.state.get('mode'),
      currentLayer: this.state.get('currentLayer'),
      latLng: e.latlng,
      map: this.map,
      zoom: this.state.get('zoom')
    });

    this.popUp.getPopUp();
  }

  _setFilters() {
    if ( !(filtersModel.filtersIsEmpty()) ) {
      this.options.filters = filtersModel.toJSON();
    } else {
      this.options.filters = null;
    }
  }

  _addLayer() {
    // Remove current pop up at beginning
    if (this.popUp) {
      this.popUp.closeCurrentPopup();
    }

    // I will draw only active layers for each category;
    const activeLayers = layersCollection.where({
      active: true,
      category: this.state.get('mode')
    });

    _.each(activeLayers, activeLayer => {
      // Selecting kind of layer by layer_type attribute
      const layerClass = (activeLayer.get('layer_type') === 'torque') ? TorqueLayer : TileLayer;
      const layerConfig = activeLayer.attributes;
      const newLayer = new layerClass(layerConfig, this.state.toJSON());
      newLayer.createLayer().done(() => {
        /* We ensure to always display the latest tiles */
        if(!this.currentLayer ||
          newLayer.timestamp > this.currentLayer.timestamp) {
          this._removeCurrentLayer();
          newLayer.addLayer(this.map);
          this.currentLayer = newLayer;
        }
      });
      this.state.set('currentLayer', activeLayer.get('slug'));
    });
  }

  _removeCurrentLayer() {
    if (this.currentLayer && this.currentLayer.removeLayer) {
      this.currentLayer.removeLayer(this.map);
      this.currentLayer = null;
    }
  }

  changeLayer() {
    this._addLayer();
  }

};

// MapView.prototype.changeLayerTimeline = (function() {
//   return _.throttle(function() {
//     this._addLayer();
//   }, 200);
// })();

MapView.prototype.changeLayerTimeline = function() {
  console.log('timeline change');
};

MapView.prototype.defaults = {
  style: location.hostname === 'localhost' ? 'mapbox.streets' : 'jhanley.a25ffffe',
  lat: 35,
  lon: -80,
  zoom: 3
};

export default MapView;
