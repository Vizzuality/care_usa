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
      items = this.model.get('sectors')[i] && this.model.get('sectors')[i].name ? items + `<li class="sector text text-legend-s -light"> ${this.model.get('sectors')[i].name} </li>` : items + '';
      i++;
    }

    return `<span class="title-sector text text-legend-s -light">Three top sectors of interest</span>
            <ul class="sectors-container">
              ${items}
            </ul>`
  }

  _getRegions() {
    let items = '';
        let i = 0;

        while( i < 3 ) {
          items = this.model.get('countries')[i] ? items + `<li class="sector text text-legend-s -light"> ${this.model.get('countries')[i].name} </li>` : items + '';
          i++;
        }

        return `<span class="title-sector text text-legend-s -light">Three top places of interest</span>
                <ul class="sectors-container">
                  ${items}
                </ul>`
  }

  _donorsModal() {
    document.getElementById('donors-modal').style.display = 'inherit';
  }

  _getContent() {
    const sectorsItems = (this.model.get('sectors').length > 0) ? this._getSectors() : '';
    const regionsItems = (this.model.get('countries').length > 0) ? this._getRegions() : '';

    return `<h1 class="text text-module-title -light"> ${ utils.numberNotation( (this.model.get('total_donors')) ) } donors - <span class="number-m">${ utils.numberNotation(  this.model.get('total_funds') )}$
    </span><span class="btn-donors" title="Donors" onclick="this._donorsModal()">+</span></h1>
    <h2 class="text text-legend-s -light">${this.model.get('location')['city']}</h2>
    ${ sectorsItems }
    ${ regionsItems }`
  }
}

PopUpDonation.prototype.model = new DonorModel();

export default PopUpDonation;

