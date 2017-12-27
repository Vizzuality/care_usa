'use strict';

import $ from 'jquery';
import AbstractPopup from './AbstractPopup';
import RefugeesModel from '../../../scripts/models/popups/RefugeesModel';

export default class RefugeesPopup extends AbstractPopup {

  fetchData() {
    const deferred = $.Deferred();

    this.model = new RefugeesModel(this.lat, this.lng, this.date);
    this.model.fetch()
      .done(data => deferred.resolve(data))
      .fail(err  => deferred.reject(err));

    return deferred;
  }

  getPopupContent() {
    const crisisLocal = (this.model.get('crisis_local')[0] &&
      this.model.get('crisis_local')[0].parties_involved.length > 0) ? `
        <div class="refugees-info">
          <p class="title-sector text text-legend-s -light">
            Countries delivering assistance to refugees from this crisis
          </p>
          <ul>
            ${this.model.get('crisis_local')[0].parties_involved.map(country => `<li class="sector text text-legend-s -light">${country.country}</li>`).join('')}
          </ul>
        </div>
      ` : '';

    const crisisAiding = (this.model.get('crisis_aiding') &&
      this.model.get('crisis_aiding').length > 0) ? `
        <div class="refugees-info">
          <p class="title-sector text text-legend-s -light">
            Crisis for which this country has refugee assistance projects
          </p>
          <ul>
            ${this.model.get('crisis_aiding').map(crisis => `<li class="sector text text-legend-s -light">${crisis.name}</li>`).join('')}
          </ul>
        </div>
      ` : '';


    return `
      <div class="wrapper -project">
        <h1 class="text text-module-title -light">
          ${this.model.get('location').name}
        </h1>
        <span class="text text-dashboard-title -light">
          ${this.model.get('crisis_local') && this.model.get('crisis_local')[0] ? this.model.get('crisis_local')[0].name : '' }
        </span>
        <hr />
        ${crisisLocal}
        ${crisisLocal && crisisAiding ? '<hr />' : ''}
        ${crisisAiding}
      </div>
    `;
  }

}
