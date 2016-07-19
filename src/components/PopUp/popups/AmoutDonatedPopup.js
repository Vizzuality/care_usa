'use strict';

import $ from 'jquery';
import moment from 'moment';
import AbstractPopup from './AbstractPopup';
import AmountDonatedModel from '../../../scripts/models/popups/AmountDonatedModel';
import DonorsModalModel from '../../../scripts/models/DonorsModalModel';
import utils from '../../../scripts/helpers/utils';

export default class AmountDonatedPopup extends AbstractPopup {

  fetchData() {
    const deferred = $.Deferred();

    this.model = new AmountDonatedModel(this.lat, this.lng, this.zoom, this.date);
    this.model.fetch()
      .done(data => deferred.resolve(data))
      .fail(err  => deferred.reject(err));

    return deferred;
  }

  getPopupContent() {
    const title = this.model.get('donors').length === 1 ?
      this.model.get('donors')[0].name :
      `${utils.numberNotation(this.model.get('total_donors'))} donations`;

    const sectorsItems = (this.model.get('sectors').length > 0) ? `
        <span class="title-sector text text-legend-s -light">
          Top Issues of Interest
        </span>
        <ul class="sectors-container">
          ${
            this.model.get('sectors')
              .slice(0, 3)
              .map(sector => `
                <li class="sector text text-legend-s -light">
                  ${sector.name}
                </li>
              `)
              .join('')
          }
        </ul>
      `: '';

    const regionsItems = (this.model.get('countries').length > 0) ? `
        <span class="title-sector text text-legend-s -light">
          Top Countries of Interest
        </span>
        <ul class="sectors-container">
          ${
            this.model.get('countries')
              .slice(0, 3)
              .map(country => `
                <li class="sector text text-legend-s -light">
                  ${country.name}
                </li>
              `)
              .join('')
          }
        </ul>
      ` : '';

    return `
      <div class="wrapper -donations">
        <header class="donation-header">
          <h1 class="text text-report-title  -light">
            ${title} -
            $${utils.numberNotation(this.model.get('total_funds'))}
            <div id="btn-donors" class="btn-donors js-popup-donation">
              +
            </div>
          </h1>
        </header>
        <h2 class="text text-legend-s -light subtitle">
          ${this.model.get('location').city}
        </h2>
      ${sectorsItems.length ? `<hr />${sectorsItems}` : sectorsItems}
      ${`${!sectorsItems.length && regionsItems.length ? '<hr />' : ''}${regionsItems}`}
      </div>
    `;
  }


  /**
   * Set event listeners inside the popup
   * @param {Object} popup popup DOM element
   */
  setListeners(popup) {
    document.querySelector('#donors-modal-content').innerHTML = `
      <h1 class="text text-module-title -dark">
        Donations list
      </h1>
      <h2 class="donors-info text text-legend-s -dark">
        ${this.model.get('total_donors')} Donations, ${this.model.get('location').city}
      </h2>
      <ul class="donors-list">
        ${
          this.model.get('donors').map(donor => {
            return `
              <li class=" text text-highlighted -dark">
                ${donor.name} -
                <span class="number number-m -dark">
                  $${donor.amount}
                </span> on
                ${moment.utc(donor.date).format('MM·DD·YYYY')}
              </li>
            `;
          }).join('')
        }
      </ul>
    `;

    popup.querySelector('.js-popup-donation').addEventListener('click', () => {
      DonorsModalModel.set({ donorsOpen: true });
    });
  }

}
