'use strict'

import './styles.postcss';
import $ from 'jquery';
import Backbone from 'backbone';
import DonorModel from './../../scripts/models/DonorModel';

import PopUp from './PopUp';

import utils from '../../scripts/helpers/utils';

class PopUpDonation extends PopUp {

  _getContent() {
    return `<h2>${ this.model.get('location')['city'] },
                ${ this.model.get('location')['state'] },
                ${ this.model.get('location')['country'] }</h2>
              <h2>Total funds: $${ this.model.get('total_funds') }</h2>
              <h2>Total # donors: ${ this.model.get('total_donors') }</h2>`
  }
}

PopUpDonation.prototype.model = new DonorModel();

export default PopUpDonation;
