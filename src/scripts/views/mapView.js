import React from 'react';
import Backbone from 'backbone';

import createTileLayer from './../helpers/createTileLayer';

var MapView =  Backbone.View.extend({

  el: 'map',

  optionsMap: {
    style: 'mapbox://styles/mapbox/streets-v8',
    center: [-3.7, 40.41],
    zoom: 3
  },

  initialize: function (options) {
    this.options = options || {};

    this.mapElement = this.options.mapElement;
    this._createMap();
  },

  _createMap: function() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiZGhha2VsaWxhIiwiYSI6InRkODNmdzAifQ.1aPjRitXRLOeocZSZ5jqAw';
    
    this.map = L.mapbox.map(this.mapElement, 'mapbox.streets').setView(this.optionsMap.center, this.optionsMap.zoom);

    this._addLayers();
  },

  _addLayers: function() {
    this.createTileLayer.createLayer();
  }
});

export default MapView;
