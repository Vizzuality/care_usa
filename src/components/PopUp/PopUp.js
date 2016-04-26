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
    this.model.customFetch(this.options).done((response) => {
      //We need to check if response is empty to not draw pop-up in that case.
      if ( Object.keys(response).length ) {
        this.options.data = this.model;
        this.options.device.mobile ?  this._drawPopUpMobile() : this._drawPopUp();
      } else {
        this.model.clear();
      }
    });
  }

  _drawPopUpMobile() {
    this.popUp = this._popUpLayer();

    $('body').append(this.popUp);
    $('.btn-close').on('click', this._closeInfowindow.bind(this));
  }

  _closeInfowindow() {
    $('.btn-close').off('click');
    $('.m-popup').remove();
  }

  _drawPopUp() {
    L.popup()
      .setLatLng(this.options.latLng)
      .setContent(this._popUpLayer())
      .openOn(this.options.map);
  }

  _getContent() {}

  _popUpLayer() {
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
