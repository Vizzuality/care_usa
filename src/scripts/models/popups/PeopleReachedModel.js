'use strict';

import Backbone from 'backbone';
import moment from 'moment';
import filtersModel from '../../../scripts/models/filtersModel';

export default class AmountDonatedModel extends Backbone.Model {

  constructor(lat, lng, date) {
    super();

    this.lat  = lat;
    this.lng  = lng;
    this.date = date;
  }

  url() {
    const filters = filtersModel.toJSON();

    const base = `${config.apiUrl}/projects?lat=${this.lat}&lng=${this.lng}`;
    const year = `year=${moment.utc(this.date || filters && filters.to).format('YYYY')}`;
    const regions = filters.region && `&countries_iso=${filters['region']}`;
    const sectors = filters.sectors.length > 0 &&
      filters.sectors
        .map(sector => `sectors_slug[]=${sector}`)
        .join('&');

    return [ base, year, regions, sectors ]
      .filter(elem => !!elem)
      .join('&');
  }

}
