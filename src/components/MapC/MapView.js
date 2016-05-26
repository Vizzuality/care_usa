'use strict';

import _ from 'underscore';
import Backbone from 'backbone';

L.mapbox.accessToken = config.mapboxToken;

const defaultBasemap = {
  url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
  options: {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }
};

class MapView extends Backbone.View {

  initialize(settings) {
    this.layersSpec = settings.layersSpec;
    this.options = _.extend({}, this.defaults, settings.options || {});
    this.createMap();
    // this.toggleLayers();
    // this.setListeners();
  }

  /**
   * Create map using Leaflet
   * http://leafletjs.com/reference.html#map-usage
   */
  createMap() {
    this.map = L.mapbox.map(this.el, config.mapboxStyle, this.options);
  }

  /**
   * Add basemap to map, use this to add other basemap instead current
   * @param {Object} basemapSpec http://leafletjs.com/reference.html#tilelayer
   */
  setBasemap(basemapSpec) {
    const currentBasemap = basemapSpec || defaultBasemap;
    if (this.basemap) {
      this.map.removeLayer(this.basemap);
    }
    this.basemap = L.tileLayer(currentBasemap.url, currentBasemap.options);
    this.basemap.addTo(this.map);
  }

  /**
   * Use this method to check all layers to show or hide them
   */
  toggleLayers() {
    if (this.layersSpec && this.layersSpec.length) {
      for (let layer of this.layersSpec.models) {
        if (layer.attributes.active && layer.layerInstance) {
          layer.layerInstance.addLayer(this.map);
        } else if (layer.layerInstance) {
          layer.layerInstance.removeLayer(this.map);
        }
      }
    }
  }

  setListeners() {
    if (this.layersSpec && this.layersSpec.length) {
      this.listenTo(this.layersSpec, 'change', this.toggleLayers.bind(this));
    }
  }

  removeAllLayers() {
    if (this.layersSpec && this.layersSpec.length) {
      for (let layer of this.layersSpec.models) {
        if (layer.layerInstance) {
          layer.layerInstance.removeLayer(this.map);
        }
      }
    }
  }

}

MapView.prototype.defaults = {
  zoom: 3,
  center: [40.71455, -74.00714], // New York
  scrollWheelZoom: false
};

export default MapView;
