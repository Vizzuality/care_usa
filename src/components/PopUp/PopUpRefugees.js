'use strict'

import './styles.postcss';
import $ from 'jquery';
import Backbone from 'backbone';
import RefugeesModel from './../../scripts/models/RefugeesModel';
import PopUp from './PopUp';
import utils from '../../scripts/helpers/utils';

class PopUpProject extends PopUp {

  _getCrisisLocalInfo() {
    return `<div class="refugees-info">
        <span class="title-sector text text-legend-s -light">Countries with projects for refugee assistance in this country</span>
        <ul>
          ${ this.model.get('crisis_local')[0] && this.model.get('crisis_local')[0]['parties_involved'].length > 0 ? this.model.get('crisis_local')[0]['parties_involved'].map(country => `<li class="sector text text-legend-s -light"> ${country.country} </li>`).join('') : ''}
        </ul>
      </div>
      <hr></hr>`
  }

   _getCrisisAidingInfo() {
    return `<div class="refugees-info">
        <span class="title-sector text text-legend-s -light">Crisis where this country has refugee assistance projects</span>
        <ul>
          ${ this.model.get('crisis_aiding')[0] && this.model.get('crisis_aiding')[0]['parties_involved'].length > 0 ? this.model.get('crisis_aiding')[0]['parties_involved'].map(country => `<li class="sector text text-legend-s -light"> ${country.country} </li>`).join('') : ''}
        </ul>
      </div>`
  }

  _getContent() {
    const title = `<h1 class="text text-module-title -light"> ${this.model.get('location')['name']}</h1>
      <hr></hr>`;

    const crisisLocal = (this.model.get('crisis_local')[0] && this.model.get('crisis_local')[0]['parties_involved'].length > 0) ? this._getCrisisLocalInfo() : '';
    const crisisAiding = (this.model.get('crisis_aiding')[0] && this.model.get('crisis_aiding')[0]['parties_involved'].length > 0) ? this._getCrisisAidingInfo() : '';

    return `<div class="wrapper -project">
              ${ title }
              ${ crisisLocal }
              ${ crisisAiding }
            </div>`
  }
}

PopUpProject.prototype.model = new RefugeesModel();

export default PopUpProject;

