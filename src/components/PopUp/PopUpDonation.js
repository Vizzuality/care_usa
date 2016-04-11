'use strict'

import './styles.postcss';
import $ from 'jquery';
import Backbone from 'backbone';
import DonorModel from './../../scripts/models/DonorModel';

import utils from '../../scripts/helpers/utils';

class PopUpDonation extends Backbone.View {

  initialize(options) {
    this.options = options;
    this.options.device = utils.checkDevice();

    this.model = new DonorModel( {lat: this.options.latLng.lat, lng: this.options.latLng.lng });

    this.model.fetch().done(() => {
      if (this.model.get('city')) {
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
    $('.m-infowindow-mb').remove();
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
              <p>Donations</p>
              <h2>${ this.model.get('city') }</h2>
            </div>
          </div>`
  }

}

export default PopUpDonation;
