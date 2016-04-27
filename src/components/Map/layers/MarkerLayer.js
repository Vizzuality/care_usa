'use strict';

class MarkerLayer {

  constructor(props) {
    this.options = props;
  }

  createLayer() {

    const latlng = [this.options.position[1], this.options.position[0]];
    // this.layer = L.marker(this.options.position || [0, 0]);
    this.layer = L.mapbox.featureLayer({
      // this feature is in the GeoJSON format: see geojson.org
      // for the full specification
      type: 'Feature',
      geometry: {
        type: 'Point',
        // coordinates here are in longitude, latitude order because
        // x, y is the standard for GeoJSON and many formats
        coordinates: latlng
      },
      properties: {
        title: this.options.title,
        // description: '1718 14th St NW, Washington, DC',

        // one can customize markers by adding simplestyle properties
        // https://www.mapbox.com/guides/an-open-platform/#simplestyle
        'marker-size': 'large',
        'marker-color': '#f52c95'
      }
    });
  }

  /**
   * Add layer to map
   * @param  {L.Map} map
   * @param {Function} callback
   */
  addLayer(map, callback) {
    this.createLayer();
    if (this.layer) {
      map.addLayer(this.layer);
    }
  }

  /**
   * Remove layer from map
   * @param  {L.Map} map
   */
  removeLayer(map) {
    if (map && this.layer) {
      map.removeLayer(this.layer);
    }
  }

}

export default MarkerLayer;
