'use strict'

import './styles.postcss';
import $ from 'jquery';
import Backbone from 'backbone';
import DonorModel from './../../scripts/models/DonorModel';

import PopUp from './PopUp';

import utils from '../../scripts/helpers/utils';

class PopUpMyDonation extends PopUp {

 _getSectors() {
    let items = '';
    let i = 0;

    while( i < 3 ) {
      items = this.model.get('sectors')[i] && this.model.get('sectors')[i].name ? items + `<li class="sector text text-legend-s -light"> ${this.model.get('sectors')[i].name} </li>` : items + '';
      i++;
    }

    return `<span class="title-sector text text-legend-s -light">Top Issues of Interest</span>
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

        return `<span class="title-sector text text-legend-s -light">Top Countries of Interest</span>
                <ul class="sectors-container">
                  ${items}
                </ul>`
  }


  _popUpLayer(myDonation) {
    const sectorsItems = this.model.get('sectors') && (this.model.get('sectors').length > 0) ? this._getSectors() : '';
    const regionsItems = this.model.get('sectors') && (this.model.get('countries').length > 0) ? this._getRegions() : '';

    return `<div class="m-popup wrapper -my-donation">
            <button class="btn-close">
              <svg class="icon icon-close"><use xlink:href="#icon-close"></use></svg>
            </button>
              <h1 class="text text-highlighted -light"> Thank you! ${myDonation.name ? `, ${myDonation.name}` : ''}
              gave <span class="number-m">$${utils.numberNotation(myDonation.amount)}</span> to help CARE fight poverty and deliver lasting change in the world.
              </h1>
              <hr/>
              <div class="donation">
                <span class="donation-box"></span>
                <span class="text text-highlighted -light">Your donation</span>
              </div>
              ${ sectorsItems }
              ${ regionsItems }
          </div>`
  }

}

PopUpMyDonation.prototype.model = new DonorModel();

export default PopUpMyDonation;

