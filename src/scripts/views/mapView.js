'use strict';

import React from 'react';
import Backbone from 'backbone';
import _ from 'underscore';

import TileLayer from './../helpers/TileLayer';

const defaults = {
  accessToken: 'pk.eyJ1IjoiZGhha2VsaWxhIiwiYSI6InRkODNmdzAifQ.1aPjRitXRLOeocZSZ5jqAw',
  style: 'mapbox://styles/mapbox/streets-v8',
  center: [-3.7, 40.41],
  zoom: 3
};

class MapView extends Backbone.View {

  initialize(options) {
    this.options = _.extend(options, defaults);

    this._createMap();
    this._addLayer();
  }

  _createMap() {
    L.mapbox.accessToken = this.options.accessToken;
    this.map = L.mapbox.map(this.options.mapElement, 'mapbox.streets', this.options);
  }

  _addLayer(options) {

    //Temporary. Until we recive options from somewhere else. 
    options = {
      sql: 'with r as (SELECT count(iso), iso FROM care_donors group by iso) SELECT r.count, r.iso, s.the_geom_webmercator FROM r inner join borders_care s on r.iso=s.iso' 
    }

    const layer = new TileLayer(options);
    layer.createLayer().then( () => { layer.addLayer(this.map) } );
  }

};

export default MapView;
