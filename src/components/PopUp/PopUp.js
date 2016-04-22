'use strict'

import './styles.postcss';
import $ from 'jquery';
import Backbone from 'backbone';
import DonorModel from './../../scripts/models/DonorModel';

import utils from '../../scripts/helpers/utils';

class PopUp extends Backbone.View {

  initialize(options) {
    this.options = options;
    this.options.device = utils.checkDevice();
    this._initData();
  }

  _initData() {
    this.model.customFetch(this.options).done(() => {
      console.log('pop', this.model)
      if (this.model.get('location')) {
        this.options.data = this.model;
        this.options.device.mobile ?  this._drawPopUpMobile() : this._drawPopUp();
      }
    });
  }

  _drawPopUpMobile() {
    this.popUp = this._getContent()

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
      .setContent(this._getContent())
      .openOn(this.options.map);
  }

  _getContent() {
    return `<div class=m-popup>
            <button class="btn-close">
              <svg class="icon icon-close"><use xlink:href="#icon-close"></use></svg>
            </button>
            <div class="wrapper">
              <h2>${ this.model.get('location')['city'] },
                ${ this.model.get('location')['state'] },
                ${ this.model.get('location')['country'] }</h2>
              <h2>Total funds: $${ this.model.get('total_funds') }</h2>
              <h2>Total # donors: ${ this.model.get('total_donors') }</h2>
            </div>
          </div>`
  }

}

export default PopUp;
