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
      items = this.model.get('sectors')[i] && this.model.get('sectors')[i].name ? items + `<li class="sector"> ${this.model.get('sectors')[i].name} </li>` : items + '';
      i++;
    }

    return `<span class="number">Sectors of interest</span>
            <ul>
              ${items}
            </ul>`
  }

  _getContent() {
    //TODO - we need percentage of reached people when filtering.
    const sectorsItems = (this.model.get('sectors').length > 0) ? this._getSectors() : '';

    return `<h2 class="title"> ${this.model.get('location')['name']} - ${ utils.numberNotation(this.model.get('filtered')['projects'])} projects</h2>
            </br>
            ${ sectorsItems }
            <p class="number"><span class="number">${ this.model.get('filtered')['people'] }</span> People reached </p>
            <p class="number"><span class="number">${ this.model.get('totals')['women_and_girls'] }</span> Women & girls</p>
            <p class="number"><span class="number">${ this.model.get('totals')['men'] }</span> Men</p>
            </br>
            <a class="link" href=#>explore country page</a>`
  }

}

PopUpProject.prototype.model = new ProjectModel();

export default PopUpProject;



// `<h2>Country: ${ this.model.get('location')['name'] }</h2>
//               <h2>Total people reached: ${ this.model.get('totals')['people'] }</h2>
//               <h2>Total projects: ${ this.model.get('totals')['projects'] }</h2>
//               <p>Total men reached: ${ this.model.get('totals')['men'] } </p>
//               <p>Total women and girls reached: ${ this.model.get('totals')['women_and_girls'] }</p>`
