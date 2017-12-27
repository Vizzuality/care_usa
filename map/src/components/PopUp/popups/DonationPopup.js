'use strict';

import $ from 'jquery';
import AbstractPopup from './AbstractPopup';
import DonationModel from '../../../scripts/models/popups/DonationModel';
import utils from '../../../scripts/helpers/utils';

export default class DonationPopup extends AbstractPopup {

  fetchData() {
    const deferred = $.Deferred();

    this.model = new DonationModel(this.lat, this.lng, this.date);
    this.model.fetch()
      .done(data => deferred.resolve(data))
      .fail(err  => deferred.reject(err));

    return deferred;
  }

  getPopupContent() {
    return `
      <div class="wrapper -donations-dist">
        <h1 class="text text-report-title -light" >
          ${this.model.get('location').country}
        </h1>
        <h2 class="text text-legend-s -light" >
          ${utils.numberNotation(this.model.get('total_donors'))} donations
        </h2>
      </div>
    `;
  }

}
