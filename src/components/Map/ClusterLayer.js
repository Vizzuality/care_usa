'use strict';

import $ from 'jquery';
import d3 from 'd3';
import utils from '../../scripts/helpers/utils';

const defaults = {
  cartodbAccount: config.cartodbAccount,
  cartodbKey: config.cartodbKey
};

class ClusterLayer {

  /*
   * Options: {
   *  account,
   *  sql,
   *  cartoCss
   * }
   */
  constructor(options, state, map) {
    this.options = Object.assign(defaults, options);
    this.options.state = state;
    this.options.map = map;
    this.timestamp = +(new Date());
  }

  createLayer() {
    const deferred = $.Deferred();

    $.get(`${config.apiUrl}/clustered_projects?zoom=${this.options.state.zoom}`,
      data => {
      this.addMarkers(data);
      return deferred.resolve(this.layer);
    });

    return deferred;
  }

  /**
   * Generate the path of an SVG arc based on a percentage
   * @param  {Number} innerRadius
   * @param  {Number} outerRadius
   * @param  {Number} percentage  0 <= percentage <=1
   * @return {String}             content of the path attribute
   */
  generateArc(innerRadius, outerRadius, percentage) {
    return d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0)
      .endAngle(percentage * 2 * Math.PI)();
  }

  /**
   * Generate the "bubble" contained within a marker
   * @param  {Array} sectors list of sectors
   * @param  {Number} total   total number of people affected
   * @param  {Number} size    size of the bubble in pixels
   * @return {String}         HTML string of the bubble (SVG element)
   */
  generateBubble(sectors, total, size) {
    const arcStroke = size <= 100 ? 2 : 3;
    const arcGap    = size <= 100 ? 1.5 : 2;

    let res = `<svg width="${size}" height="${size}">`;

    res += sectors.map((sector, index) => {
      const innerRadius = size / 2 - index * (arcStroke + arcGap) - arcStroke;
      const percentage = sector.people / total;

      return `
        <path
          d="${this.generateArc(innerRadius, innerRadius + arcStroke, percentage)}"
          fill="${sector.color}"
          transform="translate(${size / 2}, ${size / 2})"
        >
        </path>
      `;
    }).join('');

    return `${res}</svg>`;
  }

  /**
   * Add the markers to the layer
   * @param {Array} markersList list of markers from the API
   */
  addMarkers(markersList) {
    console.log(markersList);

    const bucketToSize = {
      cluster: { 1: 220, 2: 150, 3: 100         },
      marker:  { 1: 130, 2: 100, 3:  80, 4:  50 }
    };

    this.layer = L.layerGroup(markersList.map(marker => {
      const bubbleSize = bucketToSize[marker.clustered ? 'marker' : 'cluster'][marker.bucket];

      const icon = L.divIcon({
        className: `bubble-marker -size-${bubbleSize}`,
        iconSize: bubbleSize,
        iconAnchor: [bubbleSize / 2, bubbleSize / 2],
        html: `
          <div class="bubble">
            <div class="total">${utils.numberNotation(marker.total_people)}</div>
            ${this.generateBubble(marker.per_sector, marker.total_people, bubbleSize)}
            ${!marker.clustered ? `
              <div class="title">
                ${marker.name}
              </div>
            ` : ''}
          </div>
        `
      });

      return L.marker([marker.lat, marker.lng], { icon })
        .on('click', () => this.onMarkerClick(marker));
    }, this));
  }

  /**
   * Center the map to the position of the marker and zoom in until zoom 4
   * @param  {Object} marker API entity
   */
  onMarkerClick(marker) {
    this.options.map.setView([marker.lat, marker.lng], 4);
  }

  addLayer(map) {
    this.layer.addTo(map);
  }

  removeLayer(map) {
    if (this.layer) {
      map.removeLayer(this.layer);
    }
  }

  shouldLayerReload(oldZoom, zoom) {
    return oldZoom >= 4 && zoom <= 3 || oldZoom <= 3 && zoom >= 4;
  }

}

export default ClusterLayer;
