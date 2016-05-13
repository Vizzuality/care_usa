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

  _getRefugeesInfo() {
    const title = !(this.model.get('totals')['projects']) ? `<h1 class="text text-module-title -light"> ${this.model.get('location')['name']} - <span class="title-sector text text-legend-s -light">${this.model.get('crisis')[0]['name']}</span></h1>
      <hr></hr>`: `<p class="text text-report-title -light">${this.model.get('crisis')[0]['name']}</p>`

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

  _getProjectsInfo() {
    const sectorsItems = (this.model.get('sectors').length > 0) ? this._getSectors() : '';
    const refugeeTitle = this.model.get('crisis')[0] ? `<p class="title-sector text text-legend-s -light">${this.model.get('crisis')[0]['name']}</p>` : '';
    const womenText = this.model.get('totals')['women_and_girls'] ? `<p class="text-legend-s"><span class="number-m">${ utils.numberNotation(this.model.get('totals')['women_and_girls']) + '%' }</span> Women & girls</p>` : '';

    return `
      <h1 class="text text-module-title -light"> ${this.model.get('location')['name']} - <span class="number-m">${ utils.numberNotation(  this.model.get('totals')['projects'] )} projects in ${this.model.get('year')}
      </span>
      </h1>
      <hr></hr>
      ${ sectorsItems }
      <div class="numbers-donation">
        <p class="text-legend-s"><span class="number-m">${ utils.numberNotation(this.model.get('totals')['people']) }</span> People reached </p>
        ${ womenText }
      </div>
      <hr></hr>
    `
  }

  _getContent() {
    const refuggesInfo = (this.model.get('crisis')[0]) ? this._getRefugeesInfo() : '';
    const projectsInfo = (this.model.get('totals')['projects']) ? this._getProjectsInfo() : '';

    return `<div class="wrapper -project">
              ${ projectsInfo }
              ${ refuggesInfo }
              <a class="text text-cta -light" href=${this.model.attributes.url}>Explore country page</a>
              <svg class="icon icon-externallink -light">
                <use xlink:href="#icon-externallink"></use>
              </svg>
            </div>`
  }
}

PopUpProject.prototype.model = new ProjectModel();

export default PopUpProject;

