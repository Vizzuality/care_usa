'use strict';

import React from 'react';
import Backbone from 'backbone';
import _ from 'underscore';

import TileLayer from './../helpers/TileLayer';

const defaults = {
  accessToken: 'pk.eyJ1IjoiZGhha2VsaWxhIiwiYSI6InRkODNmdzAifQ.1aPjRitXRLOeocZSZ5jqAw',
  style: 'mapbox://styles/mapbox/streets-v8',
  center: [-3.7, 40.41],
  zoom: 2
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

    this._setEvents();
  }

  _setEvents() {
    this.map.on('click', this._infowindowSetUp);
  }

  _infowindowSetUp(e) {
    //TODO. Adjust postion near to borders limits.
    const latLong = e.latlng;
    const position = { left: e.containerPoint.x + 'px', top: e.containerPoint.y + 'px' };
    this.options.infowindowOpenFn(position, latLong)
  }

  _addLayer(options) {
    //Temporary. Until we recive options from somewhere else. 
    options = {
      sql: 'with r as (SELECT count(iso), iso FROM care_donors group by iso) SELECT r.count, r.iso, s.the_geom_webmercator FROM r inner join borders_care s on r.iso=s.iso' ,
      cartoCss: '#care_donors{marker-fill-opacity: 0.9;marker-line-color: #FFF;marker-line-width: 1;marker-line-opacity: 1;marker-placement: point;marker-type: ellipse;marker-width: 10;marker-fill: #FF6600;marker-allow-overlap: true;}'
   }

    const currentLayer = new TileLayer(options);
    currentLayer.createLayer().then( () => { currentLayer.addLayer(this.map) } );
  }

};

export default MapView;
