'use strict';

import $ from 'jquery';
import _ from 'underscore';
import AbstractPopup from './AbstractPopup';
import PeopleReachedModel from '../../../scripts/models/popups/PeopleReachedModel';
import sectorsCollection from '../../../scripts/collections/SectorsCollection';
import utils from '../../../scripts/helpers/utils';

export default class PeopleReachedPopup extends AbstractPopup {

  fetchData() {
    const deferred = $.Deferred();

    this.model = new PeopleReachedModel(this.options.iso, this.date);
    this.model.fetch()
      .done(data => deferred.resolve(data))
      .fail(err  => deferred.reject(err));

    return deferred;
  }

  getPopupContent() {
    const sectorToColor = this.options.sectors.map(sector => {
      const o = {};
      o[sector.slug] = sector.color;
      return o;
    }).reduce((res, o) => {
      const key = Object.keys(o)[0];
      res[key] = o[key];
      return res;
    }, {});
    const projectsInfo = this.model.attributes.is_country_office ? `
        <h1 class="text text-highlighted -light">
          ${this.model.get('location').name} -
          ${utils.numberNotation(this.model.get('totals').projects)}
          projects in ${this.model.get('year')}
        </h1>
        <hr />
        ${
          this.model.get('sectors').length > 0 ? (`
              <div class="title-sector text text-legend-s -light">
                Key Program Sectors
              </div>
            ` +
            this.model.get('sectors')
              .slice(0, 3)
              .map(sector => {
                const sectorModel =  sectorsCollection.findWhere({ slug: sector.slug });
                if(!sectorModel || _.isEmpty(sectorModel)) return '';

                const name = sectorModel.get('name');

                return `
                  <li class="sector text text-legend-s -light" style="background-color: ${sectorToColor[sector.slug]};">
                    ${name}
                  </li>
                `;
              })
              .join('')) : ''
        }
        <div class="numbers-donation">
          <div>
            <span class="number">
              ${utils.numberNotation(this.model.get('totals').people)}
            </span>
            <span class="text-legend-s">
              People reached
            </span>
          </div>
          ${
            this.model.get('totals').women_and_girls ? `
              <div>
                <span class="number">
                  ${Math.floor(this.model.get('totals').women_and_girls)}%
                </span>
                <span class="text-legend-s">
                  Women & girls
                </span>
              </div>
            ` : ''
          }
        </div>
        <hr />
      ` : `
          <h1 class="text text-highlighted -light">
            ${this.model.get('location').name} is a CARE Member Partner.
          </h1>
          <hr />
          <div class="title-sector text text-legend-s -light">
            CARE Member Partners don’t deliver programming services, but are engaged in fighting global poverty by a range of fundraising as well as citizen & political advocacy efforts.
          </div>
        `;

    return `
      <div class="wrapper -project">
          ${projectsInfo}
        <div>
          <a class="text text-cta -light" href=${this.model.get('url')}>
            Explore country page
          </a>
          <svg class="icon icon-externallink -light">
            <use xlink:href="#icon-externallink"></use>
          </svg>
        </div>
      </div>
    `;
  }

}
