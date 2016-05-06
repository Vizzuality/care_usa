'use strict'

import './styles.postcss';
import $ from 'jquery';
import Backbone from 'backbone';
import DonorModel from './../../scripts/models/DonorModel';
import DonorsModalModel from './../../scripts/models/DonorsModalModel';
import PopUp from './PopUp';

import utils from '../../scripts/helpers/utils';
import moment from 'moment';

class PopUpDonation extends PopUp {

  _getSectors() {
    let items = '';
    let i = 0;

    while( i < 3 ) {
      items = this.model.get('sectors')[i] && this.model.get('sectors')[i].name ? items + `<li class="sector text text-legend-s -light"> ${this.model.get('sectors')[i].name} </li>` : items + '';
      i++;
    }

    return `<span class="title-sector text text-legend-s -light">Top issues of interest</span>
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

        return `<span class="title-sector text text-legend-s -light">Top countries of interest</span>
                <ul class="sectors-container">
                  ${items}
                </ul>`
  }

  _donorsList() {
    let donorsList = `<h1 class="text text-module-title -dark">Donations list</h1><h2 class="donors-info text text-legend-s -dark">${this.model.attributes.total_donors} Donations, ${this.model.attributes.location['city']}</h2><ul class="donors-list">`;

    this.model.attributes.donors.map((donor) => {
      donorsList += `<li class=" text text-highlighted -dark">${donor.name} - <span class="number number-m -dark">$${donor.amount}</span> on ${moment.utc(donor.date).format('MM·DD·YYYY')}</li>`;
    });
    donorsList += '</ul>';
    return donorsList;
  }

  _getContent() {
    const sectorsItems = (this.model.get('sectors').length > 0) ? this._getSectors() : '';
    const regionsItems = (this.model.get('countries').length > 0) ? this._getRegions() : '';
    const tooltipTitle = this.model.attributes.donors.length === 1 ? 
      this.model.attributes.donors[0]['name'] : 
      utils.numberNotation( (this.model.get('total_donors')) ) + ' donations ';
    const btnTooltip = this.model.attributes.donors.length > 1 ? 
      '<div id="btn-donors" class="btn-donors js-popup-donation"><p>+</p></div>' : 
      '';

    return `<div class="wrapper -donations">
      <header class="donation-header">
        <h1 class="text text-module-title -light"> ${ tooltipTitle } -
        <span class="number-m">$${ utils.numberNotation(  this.model.get('total_funds') )}</span></h1>
        ${ btnTooltip }
      </header>
    <h2 class="text text-legend-s -light">${this.model.get('location')['city']}</h2>
    ${ sectorsItems }
    ${ regionsItems }
    </div>`
  }

  _setEventsModal() {
    $('.js-popup-donation').on('click', () => DonorsModalModel.set({donorsOpen: true}));
    document.getElementById('donors-modal-content').innerHTML = this._donorsList();
  }
}

PopUpDonation.prototype.model = new DonorModel();

export default PopUpDonation;
