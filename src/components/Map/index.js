'use strict';

import './styles.postcss';
import _ from 'underscore';
import Backbone from 'backbone';

import TileLayer from './TileLayer';
import PopUpContentView from './../PopUp/PopUpContentView';
import config from '../../config';
import layersConfig from '../../layersConfig';
import utils from '../../scripts/helpers/utils';

class MapView extends Backbone.View {

  initialize(settings) {
    // First configure mapbox
    L.mapbox.accessToken = atob(config.mapboxToken);

    // Setting default options
    this.options = _.extend({}, this.defaults, settings.options);

    //Checking for device
    this.device = utils.checkDevice();

    // Setting first state
    this.state = settings.state;
    this.state.attributes = _.extend({}, this.options, this.state.attributes);

    this._checkMapSettings();

    this._createMap();
    this._setEvents();
    this._addLayer(this.state.get('currentLayer') || 'amountOfMoney');
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

  _createMap() {
    const mapOptions = {
      zoom: this.state.attributes.zoom,
      center: [this.state.attributes.lat, this.state.attributes.lon]
    };
    this.map = L.mapbox.map(this.el, this.options.style, mapOptions);
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

    this.state.on('change:currentLayer', () => {
      const currentLayer = this.state.get('currentLayer');
      this.changeLayer(currentLayer);
    });
  }

  _infowindowSetUp(e) {
    new PopUpContentView({
      currentLayer: this.options.currentLayer,
      latLng: e.latlng,
      map: this.map
    }).getPopUp();
  }

  _addLayer(layer) {
    //We have layers into a different file until we will be able to get them from the API.
    let layerConfig = layersConfig[layer];

    this.currentLayer = new TileLayer(layerConfig);
    this.currentLayer.createLayer().then( () => { this.currentLayer.addLayer(this.map) } );
  }

  _removeCurrentLayer() {
    this.currentLayer.removeLayer(this.map);
  }

  changeLayer(layer) {
    this._removeCurrentLayer();
    this._addLayer(layer);
  }

};

MapView.prototype.defaults = {
  style: location.hostname === 'localhost' ? 'mapbox.streets' : 'jhanley.a25ffffe',
  lat: 35,
  lon: -80,
  zoom: 3
};

export default MapView;
