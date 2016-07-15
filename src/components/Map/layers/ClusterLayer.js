'use strict';

import $ from 'jquery';
import d3 from 'd3';
import utils from '../../../scripts/helpers/utils';
import PopupManager from '../../PopUp/PopupManager';

const defaults = {
  cartodbAccount: config.cartodbAccount,
  cartodbKey: config.cartodbKey
};

export default class ClusterLayer {

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

  initLayer() {
    const deferred = $.Deferred();

    $.get(`${config.apiUrl}/projects_layer?zoom=${this.options.state.zoom}&year=${this.options.state.timelineDate.getUTCFullYear()}`,
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
    const bucketToSize = {
      cluster: { 1: 220, 2: 150, 3: 100         },
      marker:  { 1: 130, 2: 100, 3:  80, 4:  50 }
    };

    this.layer = L.layerGroup(markersList.map(marker => {
      const bubbleSize = bucketToSize[marker.clustered ? 'cluster': 'marker'][marker.bucket];

      const icon = L.divIcon({
        className: `bubble-marker -size-${bubbleSize}`,
        iconSize: bubbleSize,
        iconAnchor: [bubbleSize / 2, bubbleSize / 2],
        html: `
          <div class="bubble">
            <div class="total">${utils.numberNotation(marker.total_people)}</div>
            ${this.generateBubble(marker.per_sector, marker.total_people, bubbleSize)}
            ${marker.clustered ? `
              <div class="title">
                ${marker.name}
              </div>
            ` : ''}
          </div>
        `
      });

      return L.marker([marker.lat, marker.lng], { icon })
        .on('click', e => this.onMarkerClick(marker, e.target._icon))
        .on('mouseover', e => this.onMarkerEnter(e.target._icon))
        .on('mouseout',  e => this.onMarkerLeave(e.target._icon));
    }, this));
  }

  /**
   * Center the map to the position of the marker and zoom in until zoom 4
   * @param  {Object} marker API entity
   * @param  {Object} marker DOM element
   */
  onMarkerClick(marker, DOMMarker) {
    const map = this.options.map
    const zoom = map.getZoom();
    const date = this.options.state.timelineDate;
    const slug = this.options.slug;
    const options = {
      sectors: marker.per_sector,
      closeCallback: () => DOMMarker.classList.remove('-opened')
    };

    if(zoom <= 3) {
      this.options.map.setView([marker.lat, marker.lng], 4);
    } else {
      this.closePopup();
      this.popup = new PopupManager(map, marker.lat, marker.lng, zoom, date, slug, options);
      DOMMarker.classList.add('-opened');
    }
  }

  /**
   * Add a class to the marker to move it on top of the others when hovered
   * @param  {Object} marker DOM element
   */
  onMarkerEnter(marker) {
    marker.classList.add('-ontop');
  }

  /**
   * Remove the class setting the marker on top of the others when the mouse
   * leaves it
   * @param  {Object} marker DOM element
   */
  onMarkerLeave(marker) {
    marker.classList.remove('-ontop');
  }

  shouldLayerReload(oldState, state) {
    const oldYear = oldState.timelineDate.getUTCFullYear();
    const year    = state.timelineDate.getUTCFullYear();
    return oldState.zoom >= 4 && state.zoom <= 3 ||
      oldState.zoom <= 3 && state.zoom >= 4 || oldYear !== year;
  }

  onMapClick(map, [lat, lng], zoom, date, slug) {
    this.closePopup();
  }

  /**
   * Close the popup
   */
  closePopup() {
    if(this.popup) this.popup.close();
  }

  /**
   * Update the layer according to new state
   */
  updateLayer(state) {
    return;
  }

}
