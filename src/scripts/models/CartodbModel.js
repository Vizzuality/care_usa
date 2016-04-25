'use strict';

import Backbone from 'backbone';
import $ from 'jquery';
import filtersModel from '../../scripts/models/filtersModel';

/*
 * Options: {
 *  baseUrl;
 *  table;
 *  whereClause;
 *  columns;
 * }
 */
class CartodbModel extends Backbone.Model {

  customFetch(options) {
    this.options = options;
    return this.fetch({ url: this._getUrl(options) });
  }

  _getUrl() {
    const noFilters = filtersModel.filtersIsEmpty();

    if (noFilters) {
      return `${config.apiUrl}/${this.options.currentMode}?lat=${this.options.latLng.lat}&lng=${this.options.latLng.lng}`;
    } else {
      return this._getUrlWithFilters();
    }
  }

  _getUrlWithFilters() {
    let sectors = '';
    const filters = filtersModel.toJSON();

    const startDate = filters['from'] ? ('&start_date=' + filters['from-year'] + '-' + filters['from-month'] + '-' + filters['from-day']): '';
    const endDate = filters['to'] ? ('&end_date=' + filters['to-year'] + '-' + filters['to-month'] + '-' + filters['to-day']): '';

    if (filters['sectors']) {
      let sectorsItems = [];

      $.each(filters['sectors'], function(i, sector) {
         return sectorsItems.push(sector);
      })

      sectors = '&sectors_slug=[' + sectorsItems + ']';
    }

    return `${config.apiUrl}/${this.options.currentMode}?lat=${this.options.latLng.lat}&lng=${this.options.latLng.lng}${startDate}${endDate}${sectors}`;
  }

  parse(data) {
    return data;
  }

};

CartodbModel.prototype.defaults = {
  baseUrl: `http://${config.cartodbAccount}.cartodb.com/api/v2/sql`
};

export default CartodbModel;
