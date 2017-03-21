import * as topojson from 'topojson';

L.TopoJSON = L.GeoJSON.extend({

  initialize(options = {}) {
    L.GeoJSON.prototype.initialize.call(this);

    if(!options.topoJSON) {
      throw new Error('Please provide a topoJSON object to the constructor');
    }

    if(!options.update) {
      console.warn('The update method should be overwritten to see any change when updating the data');
    }

    this.topoJSON = options.topoJSON;
    this.data = options.data || {};
    this.update = options.update || this.update;
    this.options = options;

    this.parseData();
  },

  parseData() {
    const geoStyles = {
      fillOpacity: 0,
      fillColor: this.options.defaultFillColor || undefined,
      opacity: 0,
      weight: 0,
      className: 'topojson-geo'
    };

    if (this.topoJSON.type.toLowerCase() === 'topology') {
      for(let key in this.topoJSON.objects) {
        const geojson = topojson.feature(this.topoJSON, this.topoJSON.objects[key]);
        this.addData(geojson);
      }
    } else {
      this.addData(this.topoJSON);
    }

    this.setStyle(geoStyles);
  },

  /* Define the logic to update each geometry depending on the data object.
   * To be overwritten by the user */
  update() {},

  /* Update the data attached to the layer. Call update. */
  setData(data) {
    this.data = data;
    this.eachLayer(layer => this.update(layer, this.data));
  }

});
