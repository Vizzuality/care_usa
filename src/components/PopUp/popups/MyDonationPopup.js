'use strict';

import $ from 'jquery';
import AbstractPopup from './AbstractPopup';
import sectorsCollection from '../../../scripts/collections/SectorsCollection';
import regionsCollection from '../../../scripts/collections/RegionsCollection';
import utils from '../../../scripts/helpers/utils';
import '../styles.postcss';

export default class DonationPopup extends AbstractPopup {

  fetchData() {
    const deferred = $.Deferred();
    deferred.resolve(this.options);
    return deferred;
  }

  getPopupContent() {
    const sectorsItems = (this.options.sectors && this.options.sectors.length > 0) ? `
        <span class="title-sector text text-legend-s -light">
          Top Issues of Interest
        </span>
        <ul class="sectors-container">
          ${
            this.options.sectors
              .slice(0, 3)
              .map(slug => {
                const sector =  sectorsCollection.findWhere({ slug });
                if(!sector) return '';

                return `
                  <li class="sector text text-legend-s -light">
                    ${sector.get('name')}
                  </li>
                `;
              })
              .join('')
          }
        </ul>
      `: '';

    const regionsItems = (this.options.countries && this.options.countries.length > 0) ? `
        <span class="title-sector text text-legend-s -light">
          Top Countries of Interest
        </span>
        <ul class="sectors-container">
          ${
            this.options.countries
              .slice(0, 3)
              .map(slug => {
                const country =  regionsCollection.findWhere({ slug });
                if(!country) return '';

                return `
                  <li class="sector text text-legend-s -light">
                    ${country.get('name')}
                  </li>
                `
              })
              .join('')
          }
        </ul>
      ` : '';

    return `
      <div class="wrapper -my-donation">
        <h1 class="text text-highlighted -light">
          ${this.options.nickname || 'You'}
          gave
          <span class="number-l">
            $${utils.numberNotation(this.options.amount)}
          </span>
          to help CARE fight poverty and deliver lasting change in the world.
        </h1>
        <hr />
        <div class="donation">
          <span class="donation-box"></span>
          <span class="text text-highlighted -light">Your donation</span>
        </div>
        ${sectorsItems}
        ${regionsItems}
      </div>
    `;
  }

}
