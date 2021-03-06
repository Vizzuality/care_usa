'use strict';

import Backbone from 'backbone';
import $ from 'jquery';
import _ from 'underscore';
import utils from '../../../scripts/helpers/utils';

export default class AbstractPopup extends Backbone.View {

  constructor(map, lat, lng, zoom, date, options) {
    super();
    this.map  = map;
    this.lat  = lat;
    this.lng  = lng;
    this.date = date;
    this.zoom = zoom;
    this.options = options || {};

    this.fetchData()
      .done(data => {
        if(!data || _.isEmpty(data)) {
          /* We don't want the map in an incoherent state */
          if(this.options.closeCallback &&
            typeof this.options.closeCallback === 'function') {
            this.options.closeCallback();
          }

          return;
        }
        this.data = data;
        this.open();
      })
      .fail(err => {
        throw new Error(`Unable to fetch the popup data: ${err}`);
      });
  }

  /**
   * Fetch the data, to be overriden
   * @return {Object} jQuery deferred
   */
  fetchData() {
    const deferred = $.Deferred();
    deferred.resolve();
    return deferred;
  }

  /**
   * Return the content of the popup, to be overriden
   * @return {String}      HTML string
   */
  getPopupContent() {
    return '';
  }

  /**
   * Set event listeners inside the popup
   * @param {Object} popup popup DOM element
   */
  setListeners(popup) {
    return;
  }

  /**
   * Open the popup
   */
  open() {
    const popupContent = `
      <div class=m-popup>
        <button class="btn-close">
          <svg class="icon icon-close"><use xlink:href="#icon-close"></use></svg>
        </button>
        <div class="wrapper">
          ${this.getPopupContent()}
        </div>
      </div>
    `;

    const isMobile = utils.checkDevice().mobile;

    if(isMobile) {
      this.popup = $('body').append(popupContent);
    } else {
      this.map.setView([ this.lat, this.lng ]);

      /* If the popup is attached to a marker, we want it to open the marker */
      if(this.options.marker) {
        this.popup = L.popup({
            closeButton: false,
            className: this.options && this.options.className || ''
          })
          .setContent(popupContent);

        this.options.marker
          .bindPopup(this.popup)
          .openPopup();
      } else {
        this.popup = L.popup({
            closeButton: false,
            className: this.options && this.options.className || ''
          })
          .setLatLng([ this.lat, this.lng ])
          .setContent(popupContent)
          .openOn(this.map);
      }
    }

    (this.popup._contentNode || document.querySelector('.m-popup'))
      .querySelector('.btn-close')
      .addEventListener('click', () => this.close());

    this.setListeners(this.popup._contentNode || document.querySelector('.m-popup'));
  }

  /**
   * Close the popup
   */
  close() {
    const isMobile = utils.checkDevice().mobile;

    if(isMobile) {
      if(document.querySelector('.m-popup')) {
        document.querySelector('.m-popup').remove();
      }
    } else {
      if(this.options.marker) {
        this.options.marker
          .closePopup()
          .unbindPopup();
      } else {
        this.map.closePopup();
      }
    }

    if(this.options.closeCallback &&
      typeof this.options.closeCallback === 'function') {
      this.options.closeCallback();
    }
  }

}
