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
        <p class="title-sector text text-legend-s -light">Countries delivering assistance to refugees from this crisis</p>
        <ul>
          ${ this.model.get('crisis_local')[0] && this.model.get('crisis_local')[0]['parties_involved'].length > 0 ? this.model.get('crisis_local')[0]['parties_involved'].map(country => `<li class="sector text text-legend-s -light"> ${country.country} </li>`).join('') : ''}
        </ul>
      </div>`
  }

   _getCrisisAidingInfo() {
    return `<div class="refugees-info">
        <p class="title-sector text text-legend-s -light">Crisis for which this country has refugee assistance projects</p>
        <ul>
          ${ this.model.get('crisis_aiding') && this.model.get('crisis_aiding').length > 0 ? this.model.get('crisis_aiding').map(crisis => `<li class="sector text text-legend-s -light"> ${crisis.name} </li>`).join('') : ''}
        </ul>
      </div>`
  }

  _getContent() {
    const title = `<h1 class="text text-module-title -light"> ${this.model.get('location')['name']}</h1>
      <span class="text text-dashboard-title -light"> ${this.model.get('crisis_local') && this.model.get('crisis_local')[0] ? this.model.get('crisis_local')[0]['name'] : '' }</span>
      <hr></hr>`;

    const crisisAiding = (this.model.get('crisis_aiding') && this.model.get('crisis_aiding').length > 0) ? this._getCrisisAidingInfo() : '';
    let crisisLocal = (this.model.get('crisis_local')[0] && this.model.get('crisis_local')[0]['parties_involved'].length > 0) ? this._getCrisisLocalInfo() : '';
    crisisLocal = crisisLocal !== '' && crisisAiding !== '' ? crisisLocal + '<hr></hr>' : '';

    return `<div class="wrapper -project">
              ${ title }
              ${ crisisLocal }
              ${ crisisAiding }
            </div>`
  }
}

PopUpRefugees.prototype.model = new RefugeesModel();

export default PopUpRefugees;
