'use strict'

import './styles.postcss';
import $ from 'jquery';
import Backbone from 'backbone';
import DonorDistModel from './../../scripts/models/DonorDistModel';
import PopUp from './PopUp';

import utils from '../../scripts/helpers/utils';

class PopUpDonationDist extends PopUp {

  _getContent() {
    return `<h1 class="text text-module-title -light" >${ this.model.get('location')['country'] }</h1>
            <h2 class="text text-legend-s -light" >${ utils.numberNotation( (this.model.get('total_donors')) ) } people</h2>`
  }
}

PopUpDonationDist.prototype.model = new DonorDistModel();

export default PopUpDonationDist;
