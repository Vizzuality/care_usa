'use strict';

import Backbone from 'backbone';
import $ from 'jquery';
import moment from 'moment';
import filtersModel from '../../scripts/models/filtersModel';

class PopUpModel extends Backbone.Model {

  customFetch(options) {
    this.options = options;
    return this.fetch({ url: this._getUrl() });
  }

  _getUrl() {
    const distributionLayerEndpoint = this.options.layer.slug === 'number-of-donors' ? '/distribution' : '';
    const refugeesEndpoint = this.options.layer.slug === 'refugee-assistance' ? '/refugees' : '';
    this.baseUrl = `${config.apiUrl}/${this.options.currentMode}${distributionLayerEndpoint || refugeesEndpoint }?lat=${this.options.latLng.lat}&lng=${this.options.latLng.lng}&zoom=${this.options.zoom}`;

    return this._getUrlWithFilters();
  }

  _getUrlWithFilters() {
    const filters = filtersModel.toJSON();

    let startDate;
    if(this.options.currentMode === 'donations' && this.options.timelineDate) {
      /* When the mode is donations and the layer is the SVG one (i.e.
       * "number-of-donors"), we want the first date to be 7 days before the
       * other one (so before the timeline date), otherwise, for the Torque
       * layer, we want the data of the selected day. */
      if(this.options.layer.slug === 'number-of-donors') {
        startDate = `start_date=${moment.utc(this.options.timelineDate).subtract(7, 'days').format('DD-MM-YYYY')}`;
      } else {
        startDate = `start_date=${moment.utc(this.options.timelineDate).format('DD-MM-YYYY')}`;
      }
    }
    else if(filters && filters.from) {
      startDate = `start_date = ${moment.utc(filters.from).format('DD-MM-YYYY')}`;
    }

    //To be coherent with what we are seeing on the map, we have to give prevalence to "timelineDate".
    const endDate = `end_date = ${moment.utc(this.options.timelineDate || filters && filters.to).format('DD-MM-YYYY')}`;
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
