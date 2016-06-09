'use strict'

import './styles.postcss';
import $ from 'jquery';
import Backbone from 'backbone';
import DonorModel from './../../scripts/models/DonorModel';
import sectorsCollection from '../../scripts/collections/SectorsCollection';
import regionsCollection from '../../scripts/collections/RegionsCollection';
import PopUp from './PopUp';

import utils from '../../scripts/helpers/utils';

class PopUpMyDonation extends PopUp {

 _getSectors(sectors) {
    let items = '';
    let i = 0;

    while( i < 3 ) {
      const sector = sectorsCollection.findWhere({ slug: sectors[i] });
      items = sectors[i] && sector ? 
        items + `<li class="sector text text-legend-s -light"> ${sector.attributes.name} </li>` : items + '';
      i++;
    }

    return `<span class="title-sector text text-legend-s -light">Top Issues of Interest</span>
            <ul class="sectors-container">
              ${items}
            </ul>`
  }

  _getRegions(countries) {
    let items = '';
        let i = 0;

        while( i < 3 ) {
          const country = regionsCollection.findWhere({ iso: countries[i] });
          items = countries[i] && country ? items + `<li class="sector text text-legend-s -light"> ${country.attributes.name} </li>` : items + '';
          i++;
        }

        return `<span class="title-sector text text-legend-s -light">Top Countries of Interest</span>
                <ul class="sectors-container">
                  ${items}
                </ul>`
  }


  _popUpLayer(myDonation) {
    const sectorsItems = myDonation.sectors && (myDonation.sectors.length > 0) ? this._getSectors(myDonation.sectors) : '';
    const regionsItems = myDonation.countries && (myDonation.countries.length > 0) ? this._getRegions(myDonation.countries) : '';

    return `<div class="m-popup wrapper -my-donation">
            <button class="btn-close">
              <svg class="icon icon-close"><use xlink:href="#icon-close"></use></svg>
            </button>
              <h1 class="text text-highlighted -light"> Thank you! ${myDonation.name ? `${myDonation.name}` : ''}
              gave <span class="number-l">$${utils.numberNotation(myDonation.amount)}</span> to help CARE fight poverty and deliver lasting change in the world.
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

