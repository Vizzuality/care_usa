'use strict'

import './styles.postcss';
import $ from 'jquery';
import Backbone from 'backbone';
import ProjectModel from './../../scripts/models/ProjectModel';
import PopUp from './PopUp';
import utils from '../../scripts/helpers/utils';

class PopUpProject extends PopUp {

  _getSectors() {
    let items = '';
    let i = 0;

    while( i < 3 ) {
      items = this.model.get('sectors')[i] && this.model.get('sectors')[i].name ? items + `<li class="sector text text-legend-s -light"> ${this.model.get('sectors')[i].name} </li>` : items + '';
      i++;
    }

    return `<span class="title-sector text text-legend-s -light">Key Program Sectors</span>
            <ul class="sectors-container">
              ${items}
            </ul>`
  }

  _getProjectsInfo() {
    const sectorsItems = (this.model.get('sectors').length > 0) ? this._getSectors() : '';
    const womenText = this.model.get('totals')['women_and_girls'] ? `<div><span class="number-l">${ utils.numberNotation(this.model.get('totals')['women_and_girls']) + '%' }</span><span class="text-legend-s"> Women & girls</span></div>` : '';

    return `
      <h1 class="text text-highlighted -light"> ${this.model.get('location')['name']} - ${ utils.numberNotation(  this.model.get('totals')['projects'] )} projects in ${this.model.get('year')}
      </h1>
      <hr></hr>
      ${ sectorsItems }
      <div class="numbers-donation">
        <div><span class="number-l">${ utils.numberNotation(this.model.get('totals')['people']) }</span><span class="text-legend-s"> People reached </span></div>
        ${ womenText }
      </div>
      <hr></hr>
    `
  }

  _getContent() {
    const projectsInfo = (this.model.get('totals')['projects']) ? this._getProjectsInfo() : '';

    return `<div class="wrapper -project">
              ${ projectsInfo }
              <div>
                <a class="text text-cta -light" href=${this.model.attributes.url}>Explore country page</a>
                <svg class="icon icon-externallink -light">
                  <use xlink:href="#icon-externallink"></use>
                </svg>
              </div>
            </div>`
  }
}

PopUpProject.prototype.model = new ProjectModel();

export default PopUpProject;

