'use strict';

import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';

const defaults = {
  cartodbAccount: config.cartodbAccount,
  cartodbKey: config.cartodbKey
};

const optionalStatements = {
  donations: {
    from:    (filters, timeline) => `date > '${moment(timeline.from || filters && filters.from).format('MM-DD-YYYY')}'::date`,
    to:      (filters, timeline) => `date < '${moment(timeline.to || filters && filters.to).format('MM-DD-YYYY')}'::date`,
    region:  filters => filters && filters.region ? `countries like '%${filters.region}%'` : '',
    sectors: filters => filters && filters.sectors.length ? `sectors in (${filters.sectors.map(sector => `'${sector}'`).join(', ')})` : ''
  },
  projects: {
    to:      (filters, timeline) => `year='${moment(timeline.to || filters && filters.to).format('YYYY')}'`,
    region:  filters => filters && filters.region ? `iso in ('${filters.region}')` : '',
    sectors: filters => filters && filters.sectors.length ? `(${filters.sectors.map(sector => `${sector}_people<>0`).join(' OR ')})` : ''
  }
};

class CreateTileLayer {

  /*
   * Options: {
   *  account,
   *  sql,
   *  cartoCss
   * }
   */
  constructor(options, state) {
    this.options = Object.assign(defaults, options);
    this.options.state = state;
    this.timestamp = +(new Date());
  }

  //TODO - validate date before send query.
  _getQuery() {
    const filters = this.options.state.filters;
    const timeline = this.options.state.timelineDates;
    const statements = optionalStatements[this.options.category]
    return this.options.sql_template.replace(/\s\$WHERE/g, () => {
      if(filters || timeline) {
        const res = Object.keys(statements).map(name => {
          const filter = filters[name];
            if(Array.isArray(filter) && filter.length ||
              !Array.isArray(filter) && filter || timeline) {
              return statements[name](filters, timeline);
            }
            return null;
          }).filter(statement => !!statement)
            .join(' AND ');

        if(res.length) {
          return (this.options.category === 'donations' ? 'WHERE ' : 'AND ') + res;
        }
      }
      return '';
    });
  }

  createLayer() {
    this.options.sql = this._getQuery();
    const cartoAccount = this.options.cartodbAccount;
    const cartoKey = this.options.cartodbKey;

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

    const deferred = $.Deferred();

    $.ajax({
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json; charset=UTF-8',
      url: `http://${cartoAccount}.cartodb.com/api/v1/map/`,
      data: JSON.stringify(request),
    }).done(data => {
      const tileUrl = `https://${cartoAccount}.cartodb.com/api/v1/map/${data.layergroupid}/{z}/{x}/{y}.png32`;
      this.layer = L.tileLayer(tileUrl);
      return deferred.resolve(this.layer);
    });

    return deferred;
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
