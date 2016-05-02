'use strict';

import Backbone from 'backbone';
import $ from 'jquery';
import moment from 'moment';
import filtersModel from '../../scripts/models/filtersModel';

class PopUpModel extends Backbone.Model {

  customFetch(options) {
    this.options = options;
    return this.fetch({ url: this._getUrl(options) });
  }

  _getUrl() {
    const noFilters = filtersModel.filtersIsEmpty();
    const distributionLayer = this.options.currentLayer === 'number-of-donors' ? '/distribution' : '';

    this.baseUrl = `${config.apiUrl}/${this.options.currentMode}${distributionLayer}?lat=${this.options.latLng.lat}&lng=${this.options.latLng.lng}&zoom=${this.options.zoom}`

    if (this.options.timelineDates) {
      this.baseUrl = this.baseUrl + `&start_date=${moment(this.options.timelineDates.from).format('DD-MM-YYYY')}&end_date=${moment(this.options.timelineDates.to).format('DD-MM-YYYY')}`
    }

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
