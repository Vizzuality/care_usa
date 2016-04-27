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
        } else {
          this.model.clear();
        }
      });
    } else {
      //For donation mode
      console.log('***', this.options)
      this.options.device.mobile ?  this._drawPopUpMobile(this.options) : this._drawPopUp();
    }
  }

  _drawPopUpMobile() {
    this.popUp = this._popUpLayer(this.options);

    $('body').append(this.popUp);
    $('.btn-close').on('click', this._closeInfowindow.bind(this));
  }

  _closeInfowindow() {
    $('.btn-close').off('click');
    $('.m-popup').remove();
  }

  closePopUp() {
    console.log(this);
    this.options.map.closePopup();
  }

  _drawPopUp() {
    this.popUp = L.popup({closeButton: false})
      .setLatLng(this.options.latLng)
      .setContent(this._popUpLayer(this.options))
      .openOn(this.options.map);

    this.setEvents();
  }

  setEvents() {
    $('.btn-close').on('click', this.closePopUp.bind(this))
  }

  _getContent() {}

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
