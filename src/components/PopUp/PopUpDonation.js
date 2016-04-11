'use strict'

import './styles.postcss';
import $ from 'jquery';
import Backbone from 'backbone';
import DonorModel from './../../scripts/models/DonorModel';

import PopUp from './PopUp';

import utils from '../../scripts/helpers/utils';

class PopUpDonation extends PopUp {

  _getData() {    
    this.model = new DonorModel( {lat: this.options.latLng.lat, lng: this.options.latLng.lng });

    this.model.fetch().done(() => {
      if (this.model.get('city')) {
        this.options.data = this.model;
        this.options.device.mobile ?  this._drawPopUpMobile() : this._drawPopUp();
      }
    });
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

PopUpDonation.prototype.model = new DonorModel();


export default PopUpDonation;
