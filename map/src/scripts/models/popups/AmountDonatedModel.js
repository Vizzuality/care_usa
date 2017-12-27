'use strict';

import Backbone from 'backbone';
import moment from 'moment';
import filtersModel from '../../../scripts/models/filtersModel';

export default class AmountDonatedModel extends Backbone.Model {

  constructor(lat, lng, zoom, date) {
    super();

    this.lat  = lat;
    this.lng  = lng;
    this.zoom = zoom;
    this.date = date;
  }

  url() {
    const filters = filtersModel.toJSON();

    const base = `${config.apiUrl}/donations?lat=${this.lat}&lng=${this.lng}&zoom=${this.zoom}`;
    const startDate = `start_date=${moment.utc(this.date).subtract(7, 'days').format('DD-MM-YYYY')}`;
    const endDate = `end_date=${moment.utc(this.date || filters && filters.to).format('DD-MM-YYYY')}`;
    const regions = filters.region && `&countries_iso=${filters['region']}`;
    const sectors = filters.sectors.length > 0 &&
      filters.sectors
        .map(sector => `sectors_slug[]=${sector}`)
        .join('&');

    return [ base, startDate, endDate, regions, sectors ]
      .filter(elem => !!elem)
      .join('&');
  }

}
