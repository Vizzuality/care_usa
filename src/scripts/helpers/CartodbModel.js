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

  // constructor(options) {
  //   super(options);
  //   this.options = Object.assign(this.defaults, options);
  // }
  
  url() {
    return this.options.baseUrl + this._getQuery();
  }

  _getQuery() {
    const query = "SELECT * FROM care_donors WHERE ST_Intersects(the_geom,CDB_LatLng("+ '40.71427' + ','+ '-74.00597' +"))";

    return query
  }

  parse(data) {
    return data.rows
  }
};

CartodbModel.prototype.defaults = {
  baseUrl: 'http://simbiotica.cartodb.com/api/v2/sql?q='
};

module.exports = CartodbModel;
