'use strict'

import './styles.postcss';
import $ from 'jquery';
import Backbone from 'backbone';
import RefugeesModel from './../../scripts/models/RefugeesModel';
import PopUp from './PopUp';
import utils from '../../scripts/helpers/utils';

class PopUpRefugees extends PopUp {

  _getCrisisLocalInfo() {
    return `<div class="refugees-info">
        <span class="title-sector text text-legend-s -light">Countries delivering assistance to refugees from this crisis</span>
        <ul>
          ${ this.model.get('crisis_local')[0] && this.model.get('crisis_local')[0]['parties_involved'].length > 0 ? this.model.get('crisis_local')[0]['parties_involved'].map(country => `<li class="sector text text-legend-s -light"> ${country.country} </li>`).join('') : ''}
        </ul>
      </div>
      <hr></hr>`
  }

   _getCrisisAidingInfo() {
    return `<div class="refugees-info">
        <span class="title-sector text text-legend-s -light">Crisis for which this country has refugee assistance projects</span>
        <ul>
          ${ this.model.get('crisis_aiding') && this.model.get('crisis_aiding').length > 0 ? this.model.get('crisis_aiding').map(crisis => `<li class="sector text text-legend-s -light"> ${crisis.name} </li>`).join('') : ''}
        </ul>
      </div>`
  }

  _getContent() {
    const title = `<h1 class="text text-module-title -light"> ${this.model.get('location')['name']}</h1>
      <span class="text text-dashboard-title -light"> ${this.model.get('crisis_local') && this.model.get('crisis_local')[0] ? this.model.get('crisis_local')[0]['name'] : '' }</span>
      <hr></hr>`;

    const crisisLocal = (this.model.get('crisis_local')[0] && this.model.get('crisis_local')[0]['parties_involved'].length > 0) ? this._getCrisisLocalInfo() : '';
    const crisisAiding = (this.model.get('crisis_aiding') && this.model.get('crisis_aiding').length > 0) ? this._getCrisisAidingInfo() : '';

    return `<div class="wrapper -project">
              ${ title }
              ${ crisisLocal }
              ${ crisisAiding }
            </div>`
  }
}

PopUpRefugees.prototype.model = new RefugeesModel();

export default PopUpRefugees;
