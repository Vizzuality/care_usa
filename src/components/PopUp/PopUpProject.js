'use strict'

import './styles.postcss';
import $ from 'jquery';
import Backbone from 'backbone';
import ProjectModel from './../../scripts/models/ProjectModel';

import PopUp from './PopUp';

import utils from '../../scripts/helpers/utils';

class PopUpProject extends PopUp {

  _getContent() {
    //TODO - when filtering... what happens with girls/women men?

    return `<div class=m-popup>
            <button class="btn-close">
              <svg class="icon icon-close"><use xlink:href="#icon-close"></use></svg>
            </button>
            <div class="wrapper">
              <h2>Country: ${ this.model.get('location')['name'] }</h2>
              <h2>Total people reached: ${ this.model.get('totals')['people'] }</h2>
              <h2>Total projects: ${ this.model.get('totals')['projects'] }</h2>
              <p>Total men reached: ${ this.model.get('totals')['men'] } </p>
              <p>Total women and girls reached: ${ this.model.get('totals')['women_and_girls'] }</p>
            </div>
          </div>`
  }

}

PopUpProject.prototype.model = new ProjectModel();

export default PopUpProject;
