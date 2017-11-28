'use strict';

import Backbone from 'backbone';
import moment from 'moment';
import filtersModel from '../../../scripts/models/filtersModel';

export default class AmountDonatedModel extends Backbone.Model {

  constructor(iso, date) {
    super();

    this.iso  = iso;
    this.date = date;
  }

  url() {
    const filters = filtersModel.toJSON();

    const base = `${config.apiUrl}/projects?iso=${this.iso}`;
    const year = `year=${moment.utc(this.date || filters && filters.to).format('YYYY')}`;

    return [ base, year ]
      .filter(elem => !!elem)
      .join('&');
  }

}
