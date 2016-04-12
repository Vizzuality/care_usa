'use strict';

import _ from 'underscore';
import Backbone from 'backbone';

import TileLayer from './TileLayer';
import PopUpContentView from './../PopUp/PopUpContentView';
import config from '../../config';

class MapView extends Backbone.View {

  initialize(settings) {
    // First configure mapbox
    L.mapbox.accessToken = atob(config.mapboxToken);

    // Setting default options
    this.options = _.extend({}, this.defaults, settings.options);

    // Setting first state
    this.state = settings.state;
    this.state.attributes = _.extend({}, this.options, this.state.attributes);

    this._createMap();
    this._setEvents();
    this._addLayer();
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
  }

  _infowindowSetUp(e) {
    new PopUpContentView({
      currentMap: this.options.currentMap,
      latLng: e.latlng,
      map: this.map
    }).getPopUp();
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

MapView.prototype.defaults = {
  style: 'mapbox.streets',
  lat: 40.41,
  lon: -3.7,
  zoom: 2
};

export default MapView;
