'use strict';

import './styles.postcss';
import _ from 'underscore';
import Backbone from 'backbone';
import TileLayer from './TileLayer';
import MarkerLayer from './layers/MarkerLayer';
import TorqueLayer from './TorqueLayer';
import SVGLayer from './SVGLayer';
import PopUpContentView from './../PopUp/PopUpContentView';
import layersCollection from '../../scripts/collections/layersCollection';
import filtersModel from '../../scripts/models/filtersModel';
import utils from '../../scripts/helpers/utils';
import moment from 'moment';


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
    this.state.set({ 'filters': filtersModel.toJSON() }, { silent: true });
    this._checkMapInitialSettings();

    this.timestamp = null;
    this._createMap();
    this._addLayer();
    this._setEvents();
  }

  _checkMapInitialSettings() {
    if (this.device.mobile || this.device.tablet) {
      this.state.attributes.zoom = 2;
    }

    // mobile
    if (this.device.mobile) {
      if(this.state.attributes.mode === 'projects') {
        this.state.attributes.lat = 3.8642546157214213;
        this.state.attributes.lng = -25.3125;
      }
      else {
        this.state.attributes.lat = 7;
        this.state.attributes.lng = -98;
      }

    }

    // Ipad landscape
    if ( !this.device.tablet && this.device.device ) {
      if(this.state.attributes.mode === 'projects') {
        this.state.attributes.lat = 3.8642546157214213;
        this.state.attributes.lng = -25.3125;
      }
      else {
        this.state.attributes.lat = 40;
        this.state.attributes.lng = -120;
      }
    }
  }

  drawDonationMarker(options) {
    this.markerOptions = options;
    this.donationMarker = new MarkerLayer(options);
    let markerLayer = this.donationMarker.addLayer(this.map);
    markerLayer.on('click', this.drawDonationPopUp.bind(this));
    if ( !utils.checkDevice().mobile ) this.drawDonationPopUp();
    this.state.set({ lat: options.position[0], lng: options.position[1], zoom: 3 });
  }

  drawDonationPopUp() {
    this.myDonationPopUp = new PopUpContentView({
      currentMode: 'my-donation',
      currentLayer: 'my-donation',
      latLng: this.markerOptions.position,
      map: this.map,
      name: this.markerOptions.name,
      amount: this.markerOptions.amount,
      countries: this.markerOptions.countries,
      sectors: this.markerOptions.sectors
    })

    this.myDonationPopUp.getPopUp();
    this._stopAnimation();
  }

  _stopAnimation() {
    const element = document.getElementsByClassName('icon-my-donation')[0];
    const classes = element.getAttribute('class');
    const newClasses = classes.replace('animation', '');
    element.setAttribute('class', newClasses);
  }

  _createMap() {
    const southWest = L.latLng(-80, 124),
        northEast = L.latLng(80, -124),
        bounds = L.latLngBounds(southWest, northEast);

    const mapOptions = {
      zoom: this.state.attributes.zoom,
      center: [this.state.attributes.lat, this.state.attributes.lng],
      scrollWheelZoom: false,
      // minZoom: 2,
      // maxBounds: bounds,
      tileLayer: {
        continuousWorld: false,
        noWrap: true,
      }
    };
    this.map = L.mapbox.map(this.el, this.options.style, mapOptions);

    /* Needed for the initialization of the SVG layer */
    this.state.set({ bounds: this.map.getBounds() });

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

    this.state.on('change:filters', () => this.updateLayer());
    this.state.on('change:timelineDate', () => this.updateLayer());

    this.state.on('change:mode', _.bind(this.updateLayer, this));
    layersCollection.on('change', _.bind(this.updateLayer, this));
    filtersModel.on('change', _.bind(this._updateFilters, this));

    this.map.on('zoomend', _.bind(this.onZoomMap, this));
    this.map.on('dragend', _.bind(this.onDragEndMap, this));
  }

  onZoomMap() {
    const oldZoom = this.state.get('zoom');
    const zoom    = this.map.getZoom();
    this.state.set({ zoom });

    /* We eventually reload the layer if it's an SVG one and the zoom pass 5 */
    if(this.currentLayerConfig.layer_type === 'svg' &&
      this.currentLayer.shouldLayerReload(oldZoom, zoom)) {
      this._removeCurrentLayer();
      this._addLayer();
    }
  }

  onDragEndMap() {
    /* We update the map's state */
    const position = this.map.getCenter();
    this.state.set({
      lat: position.lat,
      lng: position.lng,
      bounds: this.map.getBounds()
    });

    /* We eventually reload the layer if it's an SVG one and the zoom is quite
     * high */
    const zoom = this.map.getZoom();
    if(this.currentLayerConfig.layer_type === 'svg' &&
      this.currentLayer.shouldLayerReload(zoom, zoom)) {
      this._removeCurrentLayer();
      this._addLayer();
    }
  }

  _updateFilters() {
    this.state.set({'filters': filtersModel.toJSON()});
  }

  _infowindowSetUp(e) {
    this.popUp = new PopUpContentView({
      currentMode: this.state.get('mode'),
      layer: this.state.get('layer'),
      latLng: e.latlng,
      map: this.map,
      zoom: this.map.getZoom(),
      timelineDate: this.state.get('timelineDate'),
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
    if(this.popUp) this.popUp.closeCurrentPopup();

    let activeLayer = layersCollection.getActiveLayer(this.state.get('mode'));
    if(!activeLayer) return;

    const state = this.state.toJSON();

    /* We make sure that we don't ask for data outside the domain */
    //Lets don't do it when we have applied some filters. If we are filtering and we set 2011, with this option, we will see data from 2012 into the map. And that is not what we want.
    //We should allow users to see data (or no-data in this case) when dragging the timeline around.
    if (!this.state.attributes.filters.to) {
      if(state.timelineDate && state.layer) {
        const domain = state.layer.domain.map(date => moment.utc(date, 'YYYY-MM-DD').toDate());
        if(+state.timelineDate < +domain[0]) state.timelineDate = domain[0];
        if(+state.timelineDate > +domain[1]) state.timelineDate = domain[1];
      } else if(state.layer) { // ensure there's an initial timelineDate
        const domain = state.layer.domain.map(date => moment.utc(date, 'YYYY-MM-DD').toDate());
        state.timelineDate = domain[1];
      }
    }

    const layerConfig = activeLayer.attributes;
    let layerClass;
    switch(layerConfig.layer_type) {
      case 'torque':
        layerClass = TorqueLayer;
        break;

      case 'svg':
        layerClass = SVGLayer;
        break;

      default:
        layerClass = TileLayer;
    }

    const newLayer = new layerClass(layerConfig, state);

    newLayer.createLayer().done(() => {
      /* We ensure to always display the latest tiles */
      if((!this.currentLayer ||
        newLayer.timestamp > this.currentLayer.timestamp) &&
        newLayer.timestamp > this.timestamp) {
        newLayer.addLayer(this.map);
        this.currentLayer = newLayer;
        this.currentLayerConfig = layerConfig;

        if(this.currentLayerConfig.layer_type === 'torque') {
          this.initTorqueLayer();
        }
      }
    });
  }

  /* Hack to get to know when a torque layer has been loaded as there's no
   * proper "loaded" working event in the torque library */
  initTorqueLayer() {
    const callback = () => {
      if(!this.currentLayer || !this.currentLayer.hasData()) {
        clearTimeout(timeout);
        return;
      }

      const isReady = this.currentLayer.isReady();
      if(isReady) {
        clearTimeout(timeout);
        this.setTorquePosition();
      }
    };
    const timeout = setInterval(callback.bind(this), 200);
  }

  _removeCurrentLayer() {
    if (this.currentLayer && this.currentLayer.removeLayer) {
      this.currentLayer.removeLayer(this.map);
      this.currentLayer = null;
    }
  }

  setTorquePosition() {
    /* We just update the layer */
    const currentDate = this.state.toJSON().timelineDate
      || this.state.toJSON().filters.to;
    const step = Math.round(this.currentLayer.layer.timeToStep(currentDate));
    this.currentLayer.layer.setStep(step);
  }

  setMapCenter(center) {
    this.map.setView(center);
  }
};

MapView.prototype.updateLayer = (function() {
  /* We can't use throttle here because we wanna be sure that the last call is
   * going to be painted */
  const _addLayer = _.debounce(function() {
    this._removeCurrentLayer();
    this._addLayer();
  }, 100);

  /* Store the timestamp of the last change of the filtersModel to only
   * reload Torque's layer when the model changed ie when the timestamp changed
   */
  let filtersChangeTimestamp = 0;

  return function() {

    const activeLayer = layersCollection.getActiveLayer(this.state.get('mode'));
    if(!activeLayer) return;

    this.timestamp = +(new Date());
    if(activeLayer.get('layer_type') === 'torque' && this.currentLayerConfig &&
      this.currentLayerConfig.layer_type === 'torque') {

      const filtersOldAttributes = filtersModel.previousAttributes();
      const filtersNewAttributes = filtersModel.toJSON();

      if(filtersChangeTimestamp !== filtersModel._timestamp &&
        (!_.isEqual(filtersOldAttributes.sectors, filtersNewAttributes.sectors) ||
        filtersOldAttributes.region !== filtersNewAttributes.region)) {
        /* We reload the layer */
        _addLayer.call(this);
        filtersChangeTimestamp = filtersModel._timestamp;
      } else {
        this.setTorquePosition();
      }

    } else if(activeLayer.get('layer_type') === 'svg' &&
      this.currentLayerConfig &&
      this.currentLayerConfig.layer_type === 'svg') {

      this.currentLayer.options.state = this.state.toJSON();
      this.currentLayer.fetchData();

    } else {
      _addLayer.call(this);
    }

  };

})();

MapView.prototype.defaults = {
  style: config.mapboxStyle,
  lat: 35,
  lng: -80,
  zoom: 3
};

export default MapView;
