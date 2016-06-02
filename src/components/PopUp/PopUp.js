'use strict'

import './styles.postcss';
import $ from 'jquery';
import Backbone from 'backbone';

import utils from '../../scripts/helpers/utils';

class PopUp extends Backbone.View {

  initialize(options) {
    this.options = options;
    this.options.device = utils.checkDevice();
    this._initData();
  }

  _initData() {
    if ( !(this.options.currentMode === 'my-donation') ) {
      this.model.customFetch(this.options).done((response) => {
        //We need to check if response is empty to not draw pop-up in that case.
        if ( Object.keys(response).length ) {
          this.options.data = this.model;
          this.options.device.mobile ?  this._drawPopUpMobile() : this._drawPopUp();
          Backbone.Events.trigger('popUp:open');
        } else {
          this.model.clear();
        }
      });
    } else {
      //For donation mode
      this.options.device.mobile ?  this._drawPopUpMobile(this.options) : this._drawPopUp();
    }
  }

  _drawPopUpMobile() {
    this.popUp = this._popUpLayer(this.options);

    $('body').append(this.popUp);
    this._setEventsModal();
    $('.btn-close').on('click', this._closeInfowindow.bind(this));
  }

  _closeInfowindow() {
    $('.btn-close').off('click');
    $('.m-popup').remove();
  }

  closePopUp() {
    this.options.map.closePopup();
    Backbone.Events.trigger('popUp:close');
  }

  _panMap() {
    this.options.map.panTo(this.options.latLng);
  }

  _drawPopUp() {
    this.popUp = L.popup({closeButton: false})
      .setLatLng(this.options.latLng)
      .setContent(this._popUpLayer(this.options))
      .openOn(this.options.map);

    this.setEvents();
    this._setEventsModal();
    // this._panMap();
  }

  setEvents() {
    $('.btn-close').on('click', this.closePopUp.bind(this))
  }

  _getContent() {}

  _setEventsModal() {}

  _popUpLayer(options) {
    let content = this._getContent();
    return `<div class=m-popup>
            <button class="btn-close">
              <svg class="icon icon-close"><use xlink:href="#icon-close"></use></svg>
            </button>
            <div class="wrapper">
              ${content}
            </div>
          </div>`
  }

}

export default PopUp;
