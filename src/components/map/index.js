import React from 'react';
import Backbone from 'backbone';

var MapView =  Backbone.View.extend({

  el: 'map',

  optionsMap: {
    style: 'mapbox://styles/mapbox/streets-v8',
    center: [-3.7, 40.41],
    zoom: 3
  },

  initialize: function (options) {
    this.options = options || {};

    this.mapContainer = this.options.mapContainer;
    this._createMap();
  },

  _createMap: function() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGhha2VsaWxhIiwiYSI6InRkODNmdzAifQ.1aPjRitXRLOeocZSZ5jqAw';
    
    this.optionsMap.container = this.mapContainer;
    this.map = new mapboxgl.Map( this.optionsMap );

    // Add zoom and rotation controls to the map.
    // this.map.addControl(new mapboxgl.Navigation());
  },
});

export default MapView;
