import topojson from 'topojson';

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

    this.parseData();

    this.eachLayer(function(layer) {
      layer.setStyle({
        fillOpacity: 0,
        opacity: 0,
        weight: 1
      });
    });
  },

  parseData() {
    if (this.topoJSON.type.toLowerCase() === 'topology') {
      for(let key in this.topoJSON.objects) {
        const geojson = topojson.feature(this.topoJSON, this.topoJSON.objects[key]);
        L.GeoJSON.prototype.addData.call(this, geojson);
      }
    } else {
      L.GeoJSON.prototype.addData.call(this, this.topoJSON);
    }
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
