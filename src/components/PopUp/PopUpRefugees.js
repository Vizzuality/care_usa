'use strict'

import './styles.postcss';
import $ from 'jquery';
import Backbone from 'backbone';
import RefugeesModel from './../../scripts/models/RefugeesModel';
import PopUp from './PopUp';
import utils from '../../scripts/helpers/utils';

class PopUpProject extends PopUp {

  _getRefugeesInfo() {
    const title = `<h1 class="text text-module-title -light"> ${this.model.get('crisis')[0]['name']}</h1>
      <hr></hr>`

    return `
      ${title}
      <div class="refugees-info">
        <span class="title-sector text text-legend-s -light">Countries with projects for refugee assistance in the country</span>
        <ul>
          ${ this.model.get('crisis')[0] && this.model.get('crisis')[0]['parties_involved'].length > 0 ? this.model.get('crisis')[0]['parties_involved'].map(country => `<li class="sector text text-legend-s -light"> ${country.country} </li>`).join('') : ''}
        </ul>
      </div>
      <hr></hr>
    `
  }

  _getContent() {
    const refuggesInfo = (this.model.get('crisis')[0]) ? this._getRefugeesInfo() : '';

    return `<div class="wrapper -project">
              ${ refuggesInfo }
              <a class="text text-cta -light" href=${this.model.attributes.url}>Explore country page</a>
              <svg class="icon icon-externallink -light">
                <use xlink:href="#icon-externallink"></use>
              </svg>
            </div>`
  }
}

PopUpProject.prototype.model = new RefugeesModel();

export default PopUpProject;

