'use strict';

import './styles.postcss';
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
    this._addLayer(this.state.get('currentLayer') || 'donations');
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
    let layerConfig;

    //Temporary. Until we recive options from somewhere else.
    if (layer == 'donations') {
      layerConfig = {
        sql: 'with r as (SELECT count(iso), iso FROM care_donors group by iso) SELECT r.count, r.iso, s.the_geom_webmercator FROM r inner join borders_care s on r.iso=s.iso' ,
        cartoCss: '#care_donors{marker-fill-opacity: 0.9;marker-line-color: #FFF;marker-line-width: 1;marker-line-opacity: 1;marker-placement: point;marker-type: ellipse;marker-width: 10;marker-fill: #FF6600;marker-allow-overlap: true;}'
     }
    } else {
     layerConfig = {
       sql: 'SELECT s.the_geom, s.the_geom_webmercator, r.country, r.sum_c_c_n_peo, year FROM care_projects r inner join borders_care s on s.iso=r.iso where year = 2014 order by sum_c_c_n_peo desc' ,
       cartoCss: `#care_projects{
          polygon-fill: #FFFFB2;
          polygon-opacity: 0.8;
          line-color: #FFF;
          line-width: 0.5;
          line-opacity: 1;
        }
        #care_projects [ sum_c_c_n_peo <= 1073767] {
           polygon-fill: #B10026;
        }
        #care_projects [ sum_c_c_n_peo <= 37118] {
           polygon-fill: #E31A1C;
        }
        #care_projects [ sum_c_c_n_peo <= 13599] {
           polygon-fill: #FC4E2A;
        }
        #care_projects [ sum_c_c_n_peo <= 7769] {
           polygon-fill: #FD8D3C;
        }
        #care_projects [ sum_c_c_n_peo <= 4443] {
           polygon-fill: #FEB24C;
        }
        #care_projects [ sum_c_c_n_peo <= 1842] {
           polygon-fill: #FED976;
        }
        #care_projects [ sum_c_c_n_peo <= 572] {
           polygon-fill: #FFFFB2;
        }`
      }
    }

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
  style: 'mapbox.streets',
  lat: 40.41,
  lon: -3.7,
  zoom: 2
};

export default MapView;
