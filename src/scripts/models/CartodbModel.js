'use strict';

import Backbone from 'backbone';

/*
 * Options: {
 *  baseUrl;
 *  table;
 *  whereClause;
 *  columns;
 * }
 */
class CartodbModel extends Backbone.Model {

  url() {
    return `${config.apiUrl}/donations?${this.getQuery()}`;
  }

  getQuery() {
    const latitude = 40.71427;
    const longitude = -74.00597;
    return `lat=${latitude}&lng=${longitude}`;
  }

  parse(data) {
    return data;
  }

};

CartodbModel.prototype.defaults = {
  baseUrl: `http://${config.cartodbAccount}.cartodb.com/api/v2/sql`
};

export default CartodbModel;
