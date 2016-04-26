'use strict'

import './styles.postcss';
import $ from 'jquery';
import Backbone from 'backbone';
import DonorModel from './../../scripts/models/DonorModel';

import PopUp from './PopUp';

import utils from '../../scripts/helpers/utils';

class PopUpDonation extends PopUp {

  _getSectors() {
    let items = '';
    let i = 0;

    while( i < 3 ) {
      items = this.model.get('sectors')[i] && this.model.get('sectors')[i].name ? items + `<li class="sector"> ${this.model.get('sectors')[i].name} </li>` : items + '';
      i++;
    }

    return `<span class="number">Three top sectors of interest</span>
            <ul>
              ${items}
            </ul>`
  }

  _getRegions() {
    let items = '';
        let i = 0;

        while( i < 3 ) {
          items = this.model.get('countries')[i] ? items + `<li class="sector"> ${this.model.get('countries')[i].name} </li>` : items + '';
          i++;
        }

        return `<span class="number">Three top sectors of interest</span>
                <ul>
                  ${items}
                </ul>`
  }

  _getContent() {
    const sectorsItems = (this.model.get('sectors').length > 0) ? this._getSectors() : '';
    const regionsItems = (this.model.get('countries').length > 0) ? this._getRegions() : '';

    return `<h2 class="title"> ${ utils.numberNotation( (this.model.get('total_donors')) ) } donors - <span class="number">${ utils.numberNotation(  this.model.get('total_funds') )}$
    </span></h2>
    <h2 class="text">${this.model.get('location')['city']}</h2>
    </br>
    ${ sectorsItems }
    ${ regionsItems }`
  }
}

PopUpDonation.prototype.model = new DonorModel();

export default PopUpDonation;

