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
              <p>Thank you ${myDonation.name} Lasting change is being sent to the world<p/>
            </div>
          </div>`
  }
}

PopUpMyDonation.prototype.model = new DonorModel();

export default PopUpMyDonation;

