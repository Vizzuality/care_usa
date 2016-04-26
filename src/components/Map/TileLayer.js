'use strict';

import $ from 'jquery';
import _ from 'underscore';

const defaults = {
  cartodbAccount: config.cartodbAccount,
  cartodbKey: config.cartodbKey
};

const optionalStatements = {
  donations: {
    from:    filters => `date > '${filters['from-month']}-${filters['from-day']}-${filters['from-year']}'::date`,
    to:      filters => `date < '${filters['to-month']}-${filters['to-day']}-${filters['to-year']}'::date`,
    region:  filters => `countries like '%${filters.region}%'`,
    sectors: filters => `sectors in (${filters.sectors.map(sector => `'${sector}'`).join(', ')})`
  },
  projects: {
    to:      filters => `year='${filters['to-year']}'`,
    region:  filters => `iso in ('${filters.region}')`,
    sectors: filters => `(${filters.sectors.map(sector => `${sector}_people<>0`).join(' OR ')})`
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
  constructor(options, filters) {
    this.options = Object.assign(defaults, options);
    this.options.filters = filters;
  }

  //TODO - validate date before send query.
  _getQuery() {
    const filters = this.options.filters;
    const statements = optionalStatements[this.options.category]
    return this.options.sql_template.replace('$WHERE', () => {
      if(filters) {
        return (this.options.category === 'donations' ? 'WHERE ' : 'AND ') +
          Object.keys(statements).map(name => {
            const filter = filters[name];
            if(Array.isArray(filter) && filter.length ||
              !Array.isArray(filter) && filter) {
                if(name === 'sectors') debugger;
              return statements[name](filters);
            }
            return null;
          }).filter(statement => !!statement)
            .join(' AND ');
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
