'use strict'

import './styles.postcss';
import $ from 'jquery';
import Backbone from 'backbone';
import DonorDistModel from './../../scripts/models/DonorDistModel';

import PopUp from './PopUp';

import utils from '../../scripts/helpers/utils';

class PopUpDonationDist extends PopUp {

  _getContent() {

    return `<div class=m-popup>
            <button class="btn-close">
              <svg class="icon icon-close"><use xlink:href="#icon-close"></use></svg>
            </button>
            <div class="wrapper">
              <h2>${ this.model.get('location')['country'] }</h2>
              <h2>Total funds: $${ this.model.get('total_funds') }</h2>
              <h2>Total # donors: ${ this.model.get('total_donors') }</h2>
            </div>
          </div>`
  }
}

PopUpDonationDist.prototype.model = new DonorDistModel();

export default PopUpDonationDist;