'use strict';

import Backbone from 'backbone';
import $ from 'jquery';
import filtersModel from '../../scripts/models/filtersModel';

class PopUpModel extends Backbone.Model {

  customFetch(options) {
    this.options = options;
    return this.fetch({ url: this._getUrl(options) });
  }

  _getUrl() {
    const noFilters = filtersModel.filtersIsEmpty();
    const ditributionLayer = this.options.currentLayer === 'number-of-donors' ? '/distribution' : '';

    this.baseUrl = `${config.apiUrl}/${this.options.currentMode}${ditributionLayer}?lat=${this.options.latLng.lat}&lng=${this.options.latLng.lng}`

    if (noFilters) {
      return this.baseUrl;
    } else {
      return this._getUrlWithFilters();
    }
  }

  _getUrlWithFilters() {
    let sectors = '';
    const filters = filtersModel.toJSON();

    const startDate = filters['from'] ? ('&start_date=' + filters['from-year'] + '-' + filters['from-month'] + '-' + filters['from-day']): '';
    const endDate = filters['to'] ? ('&end_date=' + filters['to-year'] + '-' + filters['to-month'] + '-' + filters['to-day']): '';
    const regions = filters['region'] ? '&countries_iso=' + filters['region'] : '';

    if (filters['sectors'].length > 0) {

      $.each(filters['sectors'], function(i, sector) {
        sectors = sectors + '&sectors_slug[]=' + sector
      })
    }

    return `${this.baseUrl}${startDate}${endDate}${sectors}${regions}`;
  }

  parse(data) {
    return data;
  }

};


export default PopUpModel;
