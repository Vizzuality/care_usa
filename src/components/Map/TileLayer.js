'use strict';

import config from './../../config';
import $ from 'jquery';

const defaults = {
  cartodbAccount: config.cartodbAccount
};

class CreateTileLayer {

  /*
   * Options: {
   *  account,
   *  sql,
   *  cartoCss
   * }
   */
  constructor(options) {
    this.options = Object.assign(defaults, options);

    this.options.sqlTemplate = 'SELECT * FROM donors $WHERE';
    this.options.filters = [{"sectors":[],"from-day":"3","from-month":"3","from-year":"2012","to-day":"2","to-month":"6","to-year":"2015","region":"NPL","from":"2012-03-03T00:00:00.000Z","to":"2015-06-02T00:00:00.000Z"}];
  }

  _getQuery() {
    let sqlTemplate = this.options.sqlTemplate;
    let sql;  

    if (this.options.filters) {
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
    
    filters = this.options.filters[0];

    if (filters.from) {
      from = "date > '" + filters['from-month'] + '-' + filters['from-day'] + '-' + filters['from-year'] + "'::date ";

      if (filters.to || filters.region || filters.sectors.length < 0) {
        from = from + "AND ";
      }
    }

    if (filters.to) {
      to = "date < '" + filters['to-month'] + '-' + filters['to-day'] + '-' + filters['to-year'] + "'::date ";

      if (filters.region || filters.sectors.length < 0) {
        to = to + "AND ";
      }
    }

    if (filters.region) {
      region = "countries like '%" + filters.region + "%' ";

      if (filters.sectors.length < 0) {
        region = region + "AND ";
      }
    }

    if (filters.sectors.length < 0) {
      let sectorsItems = "";
      let items = filters.sectors.length;

      $.each(filters.sectors, function(i, sector) {
        sectorsItems = sectorsItems + "'" + sector + "'";
        if (i < (items - 1)) { sectorsItems = sectorsItems + ", " }
      })

      sectors = "sectors in ("+ sectorsItems +"); ";
    }

    return 'WHERE ' + from + to + region + sectors;
  }

  createLayer() {
    this.options.sql = this._getQuery();
    console.log( this.options.sql )
    const cartoAccount = this.options.cartodbAccount;

    // data layers parameterization
    const request = {
      layers: [{
        'user_name': cartoAccount,
        'type': 'cartodb',
        'options': {
          'sql': this.options.sql,
          'cartocss': this.options.cartoCss,
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
