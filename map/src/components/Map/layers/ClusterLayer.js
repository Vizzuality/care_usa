'use strict';

import $ from 'jquery';
import d3 from 'd3';
import utils from '../../../scripts/helpers/utils';
import PopupManager from '../../PopUp/PopupManager';

const defaults = {
  cartodbAccount: config.cartodbAccount,
  cartodbKey: config.cartodbKey
};

const bucketToSize = {
  cluster: { 1: 180, 2: 150, 3: 100         },
  marker:  { 1: 130, 2: 100, 3:  80, 4:  50 },
  cluster_mobile: { 1: 130, 2: 110, 3: 90 },
  marker_mobile: { 1: 110, 2: 90, 3: 70, 4: 50 }
};

export default class ClusterLayer {

  /*
   * Options: {
   *  account,
   *  sql,
   *  cartoCss
   * }
   */
  constructor(options, state, map, isMobile) {
    this.options = Object.assign(defaults, options);
    this.options.state = state;
    this.options.map = map;
    this.timestamp = +(new Date());
    this.isMobile = isMobile;
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
    const zoom = this.options.map.getZoom();

    const bubbleKeySufx = this.isMobile ? '_mobile' : '';
    this.layer = L.layerGroup(markersList.map(marker => {
      const bubbleSize = bucketToSize[(marker.clustered ? 'cluster': 'marker')+bubbleKeySufx][marker.bucket];
      let icon = {};
      if (!marker.is_country_office) {
        icon = L.divIcon({
          className: `bubble-marker -size-50`,
          iconSize: bubbleSize,
          iconAnchor: [bubbleSize / 2, bubbleSize / 2],
          popupAnchor: [0, -bubbleSize / 2],
          html: `
            <div class="bubble-dark">
              <div class="total">CMP</div>
              ${zoom >= 6 ? `
                <div class="title">
                  ${marker.name}
                </div>
              ` : `
              <div class="title-clustered">
                ${marker.name}
              </div>
              `}
            </div>
          `
        });
      } else if (marker.is_country_office && marker.total_people < 200) {
        icon = '';
      } else {
        icon = L.divIcon({
          className: `bubble-marker -size-${bubbleSize}`,
          iconSize: bubbleSize,
          iconAnchor: [bubbleSize / 2, bubbleSize / 2],
          popupAnchor: [0, -bubbleSize / 2],
          html: `
            <div class="bubble">
              <div class="total">${utils.numberNotation(marker.total_people)}</div>
              ${this.generateBubble(marker.per_sector, marker.total_people, bubbleSize)}
              ${marker.clustered || zoom >= 6 ? `
                <div class="title">
                  ${marker.name}
                </div>
              ` : `
              <div class="title-clustered">
                ${marker.name}
              </div>
              `}
            </div>
          `
        });
      }


      return L.marker([marker.lat, marker.lng], { icon })
        .on('click', e => this.onMarkerClick(marker, e.target._icon, e.target))
        .on('mouseover', e => this.onMarkerEnter(e.target._icon))
        .on('mouseout',  e => this.onMarkerLeave(e.target._icon));
    }, this));
  }

  /**
   * Center the map to the position of the marker and zoom in until zoom 4
   * @param  {Object} marker API entity
   * @param  {Object} marker DOM element
   * @param  {Object} marker Leaflet object
   */
  onMarkerClick(marker, DOMMarker, LeafletMarker) {
    const map = this.options.map
    const zoom = map.getZoom();
    const date = this.options.state.timelineDate;
    const slug = this.options.slug;

    const popupOffset = bucketToSize[marker.clustered ? 'cluster': 'marker'][marker.bucket] / 2;

    const options = {
      iso: marker.iso,
      sectors: marker.per_sector,
      closeCallback: () => DOMMarker.classList.remove('-opened'),
      marker: LeafletMarker
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
    /* marker could be falsy if the user clicks on a high level cluster as this
     * one automatically disappears */
    if(!marker) return;

    marker.classList.remove('-ontop');
  }

  shouldLayerReload(oldState, state) {
    const oldYear = oldState.timelineDate.getUTCFullYear();
    const year    = state.timelineDate.getUTCFullYear();
    return oldState.zoom >= 4 && state.zoom <= 3 ||
      oldState.zoom <= 3 && state.zoom >= 4 ||
      oldState.zoom >= 6 && state.zoom <= 5 ||
      oldState.zoom <= 5 && state.zoom >= 6 ||
      oldYear !== year;
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
