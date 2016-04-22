'use strict';

import config from './../../config';
import $ from 'jquery';
import _ from 'underscore';

const defaults = {
  cartodbAccount: config.cartodbAccount,
  cartodbKey: config.cartodbKey
};

class CreateTileLayer {

  /*
   * Options: {
   *  account,
   *  sql,
   *  cartoCss
   * }
   */
  constructor(options, filters) {
    this.options = Object.assign(defaults, options);
    this.options.filters = filters;
  }

  _getQuery() {
    let sqlTemplate = this.options['sql_template'];
    let sql;
    let whereStatment = _.indexOf(sqlTemplate.split(' '), '$WHERE') > 0 && true;

    if (this.options.filters && whereStatment) {
      sql = sqlTemplate.replace('$WHERE', this._getFiltersExp())
    } else {
      sql = sqlTemplate.replace('$WHERE','');
    }

    return sql;
  }

  _getFiltersExp() {
    let filters, filtersExp;
    let from = '';
    let to = '';
    let region = '';
    let sectors = '';

    filters = this.options.filters;

    if (filters.from) {
      from = "date > '" + filters['from-month'] + '-' + filters['from-day'] + '-' + filters['from-year'] + "'::date ";

      if (filters.to || filters.region || filters.sectors.length > 0) {
        from = from + "AND ";
      }
    }

    if (filters.to) {
      to = "date < '" + filters['to-month'] + '-' + filters['to-day'] + '-' + filters['to-year'] + "'::date ";

      if (filters.region || filters.sectors.length > 0) {
        to = to + "AND ";
      }
    }

    if (filters.region) {
      region = "countries like '%" + filters.region + "%' ";

      if (filters.sectors.length > 0) {
        region = region + "AND ";
      }
    }

    if (filters.sectors.length > 0) {
      let sectorsItems = "";
      let items = filters.sectors.length;

      $.each(filters.sectors, function(i, sector) {
        sectorsItems = sectorsItems + "'" + sector + "'";
        if (i < (items - 1)) { sectorsItems = sectorsItems + ", " }
      })

      sectors = "sectors in ("+ sectorsItems +") ";
    }

    return 'WHERE ' + from + to + region + sectors;
  }

  createLayer() {
    this.options.sql = this._getQuery();
    const cartoAccount = this.options.cartodbAccount;
    const cartoKey = this.options.cartodbKey;

    // console.log(this.options.sql);

    // data layers parameterization
    const request = {
      layers: [{
        'user_name': cartoAccount,
        'type': 'cartodb',
        'options': {
          'sql': this.options.sql,
          'cartocss': this.options['geo_cartocss'],
          'cartocss_version': '2.3.0'
        }
      }]
    };

    const promise = new Promise( (resolve) => {

      $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        url: 'http://'+ cartoAccount +'.cartodb.com/api/v1/map/',
        data: JSON.stringify(request),
        success: (data) => {

          const tileUrl = 'https://' + cartoAccount + '.cartodb.com/api/v1/map/' + data.layergroupid + '/{z}/{x}/{y}.png32';
          this.layer = L.tileLayer(tileUrl);

          resolve(this.layer);
        }
      });
    });

    return promise;
  }

  addLayer(map) {
    this.layer.addTo(map);
  }

  removeLayer(map) {
    if (this.layer) {
      map.removeLayer(this.layer);
    }
  }

}

export default CreateTileLayer;
