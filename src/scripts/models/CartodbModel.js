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
    return `${this.options.baseUrl}?q=${this.getQuery()}`;
  }

  getQuery() {
    const latitude = 40.71427;
    const longitude = -74.00597;
    return `SELECT city, date FROM care_donors
      WHERE ST_Intersects(the_geom, CDB_LatLng('${latitude}','${longitude}'))`;
  }

  parse(data) {
    return data.rows[0];
  }

};

CartodbModel.prototype.defaults = {
  baseUrl: `http://${config.cartodbAccount}.cartodb.com/api/v2/sql`
};

export default CartodbModel;
