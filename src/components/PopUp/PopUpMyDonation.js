'use strict'

import './styles.postcss';
import $ from 'jquery';
import Backbone from 'backbone';
import DonorModel from './../../scripts/models/DonorModel';

import PopUp from './PopUp';

import utils from '../../scripts/helpers/utils';

class PopUpMyDonation extends PopUp {

  _popUpLayer(myDonation) {
    // console.log('my donation', myDonation)
    return `<div class="m-popup -my-donation">
            <button class="btn-close">
              <svg class="icon icon-close"><use xlink:href="#icon-close"></use></svg>
            </button>
            <div class="wrapper">
              <h1>Thank you${myDonation.name ? `, ${myDonation.name}` : ''}. Your gift is on its way to someone in need.</h1>
              <div class="donation">
                <span class="donation-box"></span>
                <span class="text">Your donation</span>
              </div>
            </div>
          </div>`
  }
}

PopUpMyDonation.prototype.model = new DonorModel();

export default PopUpMyDonation;

