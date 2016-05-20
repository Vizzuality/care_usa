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
    const distributionLayerEndpoint = this.options.layer.slug === 'number-of-donors' ? '/distribution' : '';
    const refugeesEndpoint = this.options.layer.slug === 'refugee-assistance' ? '/refugees' : '';

    this.baseUrl = `${config.apiUrl}/${this.options.currentMode}${distributionLayerEndpoint || refugeesEndpoint }?lat=${this.options.latLng.lat}&lng=${this.options.latLng.lng}&zoom=${this.options.zoom}`;

    if(this.options.timelineDate && this.options.layer) {
      this.baseUrl = this.baseUrl + `&start_date=${moment.utc(this.options.layer.domain[0]).format('DD-MM-YYYY')}&end_date=${moment.utc(this.options.timelineDate).format('DD-MM-YYYY')}`
    }

    if (noFilters) {
      return this.baseUrl;
    } else {
      return this._getUrlWithFilters();
    }
  }

  _getUrlWithFilters() {
    const filters = filtersModel.toJSON();

    const startDate = filters.from && `start_date = ${moment(filters.from).format('MM-DD-YYYY')}`;
    //To be coherent with what we are seeing on the map, we have to give prevalence to "timelineDate".
    const endDate = (filters && filters.to || this.options.timelineDate) ? `endDate = ${moment.utc(this.options.timelineDate || filters && filters.to).format('MM-DD-YYYY')}` : '';
    const regions = filters.region && `countries_iso=${filters['region']}`;

    let sectors = null;
    if(filters.sectors.length > 0) {
      sectors = filters.sectors
        .map(sector => `sectors_slug[]=${sector}`)
        .join('&')
    }

    return [ this.baseUrl, startDate, endDate, regions, sectors ]
      .filter(elem => !!elem)
      .join('&');
  }

  parse(data) {
    return data;
  }

};


export default PopUpModel;
