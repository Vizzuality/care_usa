'use strict';

import $ from 'jquery';
import AbstractPopup from './AbstractPopup';
import utils from '../../../scripts/helpers/utils';
import countryCodes from '../../../lib/country-codes';
import kebabCase from 'lodash/kebabCase';
import lowerCase from 'lodash/lowerCase';
import upperFirst from 'lodash/upperFirst';

export default class DonationPopup extends AbstractPopup {

  fetchData() {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${this.lat}&lon=${this.lng}&format=json`;
    return $.getJSON(url)
        .then(function(data) {
          if (data && data.address) {
            const countryCode = data.address.country_code.toUpperCase() || '';
            const countryName = data.address.country;
            const isoCode = countryCodes[countryCode];
            if (isoCode) {
              const contentfulUrl = `https://cdn.contentful.com/spaces/${config.cspace}/entries?content_type=story&fields.countryList%5Bin%5D=${isoCode}&access_token=${config.ctoken}`;
              return $.getJSON(contentfulUrl)
                .then(function(response) {
                  if (!response || !response.items || !response.items.length) throw new Error('no stories');
                  const stories = response.items.map((s, i) => ({
                    title: upperFirst(lowerCase(s.fields.title)),
                    img: `http:${response.includes.Asset[i].fields.file.url}?q=80&w=40&h=40`,
                    link: `/stories/${kebabCase(s.fields.title)}`
                  }))
                  return {
                    countryName,
                    isoCode,
                    stories
                  }
                })
            }
          }
          return {};
        })
  }

  getPopupContent() {
    const { stories, countryName } = this.data;

    return `
      <div class="wrapper -stories-dist">
        <h1 class="text text-report-title -light" >
          ${countryName} stories
        </h1>
        ${!!stories.length &&
          `<ul>
            ${stories.map(s => (
              `<li>
                <a href="${s.link}">${s.title}</a>
              </li>`
            )).join('')}
          </ul>`
        }
      </div>
    `;
  }

}
