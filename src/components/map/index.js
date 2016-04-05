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

    this.mapElement = this.options.mapElement;
    this._createMap();
  },

  _createMap: function() {
    L.mapbox.accessToken = 'pk.eyJ1IjoiZGhha2VsaWxhIiwiYSI6InRkODNmdzAifQ.1aPjRitXRLOeocZSZ5jqAw';
    
    this.map = L.mapbox.map(this.mapElement, 'mapbox.streets').setView([38.8929,-77.0252], 14);

    this._addLayers();
  },

  _addLayers: function() {
    console.log('load')
    L.tileLayer('https://cartocdn-ashbu.global.ssl.fastly.net/simbiotica/api/v1/map/ad78f28b63c643a6a793885abdd63e14:1459237782618/0/{z}/{x}/{y}.png').addTo(this.map);


    // https://cartocdn-ashbu.global.ssl.fastly.net/simbiotica/api/v1/map/ad78f28b63c643a6a793885abdd63e14:1459237782618/0/3/5/3.png
  }
});

export default MapView;
