'use strict';

import './styles.postcss';
import _ from 'underscore';
import Backbone from 'backbone';
import '../../lib/leaflet.activearea';
import TileLayer from './layers/TileLayer';
import TorqueLayer from './layers/TorqueLayer';
import SVGLayer from './layers/SVGLayer';
import ClusterLayer from './layers/ClusterLayer';
import MyDonationMarker from './MyDonationMarker';
import layersCollection from '../../scripts/collections/layersCollection';
import filtersModel from '../../scripts/models/filtersModel';
import utils from '../../scripts/helpers/utils';
import moment from 'moment';


class MapView extends Backbone.View {

  initialize(settings) {
    // Setting default options
    this.options = _.extend({}, this.defaults, settings.options);

    //Checking for device
    this.device = utils.checkDevice();

    // Setting first state
    this.state = new Backbone.Model(settings.state);
    this.state.attributes = _.extend({}, this.options, this.state.attributes);
    this.state.set({ 'filters': filtersModel.toJSON() }, { silent: true });
    this._checkMapInitialSettings();

    this.timestamp = +(new Date());
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
        this.state.attributes.lat = 0;
        this.state.attributes.lng = 0;
      }
      else {
        this.state.attributes.lat = 7;
        this.state.attributes.lng = -98;
      }

    }

    // Ipad landscape
    if ( !this.device.tablet && this.device.device ) {
      if(this.state.attributes.mode === 'projects') {
        this.state.attributes.lat = 0;
        this.state.attributes.lng = 0;
      }
      else {
        this.state.attributes.lat = 40;
        this.state.attributes.lng = -120;
      }
    }
  }

  /**
   * Enable the donation marker on the map
   * @param  {String} data the unique identifier of the donation
   */
  enableMyDonationMarker(donationId) {
    this.myDonationMarker = new MyDonationMarker(donationId, this.state.get('layer').slug, this.map);
  }

  /**
   * Update the visibility of the donation marker depending on the layer
   */
  updateMyDonationMakerVisibility() {
    if(!this.myDonationMarker) return;
    this.myDonationMarker.updateVisibility(this.state.get('layer').slug);
  }

  _createMap() {
    const southWest = L.latLng(-80, 124),
        northEast = L.latLng(80, -124),
        bounds = L.latLngBounds(southWest, northEast);

    const mapOptions = {
      zoom: this.state.attributes.zoom,
      center: [this.state.attributes.lat, this.state.attributes.lng],
      scrollWheelZoom: false,
      zoomControl: false,
      // minZoom: 2,
      // maxBounds: bounds,
      tileLayer: {
        continuousWorld: false,
        noWrap: true,
      }
    };

    this.map = new L.Map(this.el, mapOptions)
      .setActiveArea({
        position: 'absolute',
        top: '100px',
        left: '0',
        right: '0',
        height: 'calc(100% - 100px)'
      });

    /* We use a custom zoom control in order to change the text used for the
     * zoom out button: "–" instead of "-" (this first one is wider on screen)
     */
    L.control.zoom({ zoomOutText: '–' }).addTo(this.map);

    L.tileLayer('https://{cartodbAccount}.carto.com/api/v1/map/named/{basemap}/0/{z}/{x}/{y}.png', {
      attribution: '<a href="https://carto.com/attributions/">© CartoDB</a>',
      id: this.options.style,
      basemap: config.basemap,
      cartodbAccount: config.cartodbAccount
    }).addTo(this.map);

    /* Needed for the initialization of the SVG layer */
    this.state.set({ bounds: this.map.getBounds() });

    this._addAttributions();
  }

  _addAttributions() {
    // Add attribution to Mapbox and OpenStreetMap.
    this.map.attributionControl.removeAttribution('Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>')
      .setPrefix('')
      .addAttribution('<a href="http://openstreetmap.org/copyright"> © OpenStreetMap</a>');
  }

  _setEvents() {
    this.map.on('click', this.onMapClick.bind(this));

    this.state.on('change:filters', () => this.updateLayer());
    this.state.on('change:timelineDate', () => this.updateLayer());
    this.state.on('change:layer', () => this.updateMyDonationMakerVisibility());

    this.state.on('change:mode', _.bind(this.updateLayer, this));
    layersCollection.on('change', _.bind(this.updateLayer, this));
    filtersModel.on('change', _.bind(this._updateFilters, this));

    this.map.on('zoomend', _.bind(this.onZoomMap, this));
    this.map.on('dragend', _.bind(this.onDragEndMap, this));
  }

  /**
   * Return true if the layer should be reloaded due to changes in the app
   * @return {Boolean} true if should be reloaded, false otherwise
   */
  shouldLayerReload() {
    if(!this.currentLayer) return false;

    /* The timestamp is used to determine if the filters changed */
    if(!this.filtersTimestamp) this.filtersTimestamp = +(new Date());

    const oldState = this.state.previousAttributes();
    oldState.filters.timestamp = this.filtersTimestamp;
    const state = this.state.toJSON();
    state.filters.timestamp = filtersModel._timestamp;

    this.filtersTimestamp = filtersModel._timestamp;

    return this.currentLayer.shouldLayerReload(oldState, state);
  }

  /**
   * Remove the current layer from the map
   */
  removeCurrentLayer() {
    if(!this.currentLayer) return;

    this.currentLayer.closePopup();
    this.map.removeLayer(this.currentLayer.layer);
    this.currentLayer = null;
  }

  /**
   * Add a new layer to the map
   */
  addNewLayer() {
    /* TODO */
    this._addLayer();
  }

  onZoomMap() {
    const oldZoom = this.state.get('zoom');
    const zoom    = this.map.getZoom();
    this.state.set({ zoom });

    if(this.shouldLayerReload()) {
      this.removeCurrentLayer();
      this.addNewLayer();
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

    if(this.shouldLayerReload()) {
      this.removeCurrentLayer();
      this.addNewLayer();
    }
  }

  _updateFilters() {
    this.state.set({'filters': filtersModel.toJSON()});
  }

  onMapClick(e) {
    if(!this.currentLayer) return;

    this.currentLayer.onMapClick(this.map, [e.latlng.lat, e.latlng.lng],
      this.map.getZoom(), this.state.get('timelineDate'),
      this.state.get('layer').slug);
  }

  _setFilters() {
    if ( !(filtersModel.filtersIsEmpty()) ) {
      this.options.filters = filtersModel.toJSON();
    } else {
      this.options.filters = null;
    }
  }

  _addLayer() {
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

      case 'cluster':
        layerClass = ClusterLayer;
        break;

      default:
        layerClass = TileLayer;
    }

    /* Here we need to take care of a really nasty unwanted behavior. If we use
     * this.currentLayerConfig as a reference to the previous layer, and
     * layerConfig as the one for the new layer, we'll run into issues if the
     * layers are switched quickly. What happens is that we won't be able to see
     * all the transitions between the layers. For example, we could see A -> B
     * but never B -> A if we switched alternatively between two of them.
     * Instead, we could see A -> B and later A -> A, meaning we went back to
     * the first layer.
     * In order to fix this issue that messes up with the UI, we save the slug
     * of the previous layer in a variable called this.previousLayerSlug and
     * compare it to the new layer's slug. This way we can be sure of the
     * transition. */

    /* The layer "people-reached" doesn't support the filters, we thus need to
     * disable them
     * NOTE: layerConfig            -> new layer
     * 			 this.previousLayerSlug -> old layer
     */
    if(layerConfig.slug === 'people-reached' &&
      (!this.previousLayerSlug || this.previousLayerSlug !== 'people-reached')) {
      filtersModel.disable();
    } else if(layerConfig.slug !== 'people-reached' && this.previousLayerSlug
      && this.previousLayerSlug == 'people-reached') {
      filtersModel.restore();
    }

    /* We finally update the "pointer" to the previous slug */
    this.previousLayerSlug = layerConfig.slug;

    const newLayer = new layerClass(layerConfig, state, this.map, this.device.mobile);

    newLayer.initLayer().done(() => {
      /* We ensure to always display the latest tiles */

      if((!this.currentLayer ||
        newLayer.timestamp > this.currentLayer.timestamp) &&
        newLayer.timestamp >= this.timestamp) {
        newLayer.layer.addTo(this.map);
        this.currentLayer = newLayer;
        this.currentLayerConfig = layerConfig;
      }
    });
  }

};

MapView.prototype.updateLayer = (function() {
  /* We can't use throttle here because we wanna be sure that the last call is
   * going to be painted */
  const _addLayer = _.debounce(function() {
    this.timestamp = +(new Date());
    this.removeCurrentLayer();
    this._addLayer();
  }, 16);

  return function() {
    const activeLayer = layersCollection.getActiveLayer(this.state.get('mode'));
    if(!activeLayer) return;


    if(this.currentLayerConfig &&
      activeLayer.get('layer_type') !== this.currentLayerConfig.layer_type) {
      _addLayer.call(this);
    } else if(this.shouldLayerReload()) {
      _addLayer.call(this);
    } else if(this.currentLayer) {
      this.currentLayer.updateLayer(this.state.toJSON());
    } else {
      /* In some extreme cases, when switching quickly between the two dashboard
       * tabs, the old and new layer will be the same, but this.currentLayer
       * would be null because the map add sufficient time to remove the layer.
       * So we want this fallback to re-add the layer. */
      _addLayer.call(this);
    }

  };

})();

MapView.prototype.defaults = {
  style: config.mapboxStyle,
  lat: 0,
  lng: 0,
  zoom: 3
};

export default MapView;
