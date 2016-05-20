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
    from:    (filters, timelineDate, layer) => filters && filters.from ? `date >= '${moment.utc(filters.from).format('MM-DD-YYYY')}'::date` : `date >= '${moment.utc(layer.domain[0], 'YYYY-MM-DD').format('MM-DD-YYYY')}'::date`,
    to:      (filters, timelineDate) => `date <= '${moment.utc(timelineDate || filters && filters.to).format('MM-DD-YYYY')}'::date`,
    region:  filters => filters && filters.region ? `countries @> ARRAY[${filters.region.replace(/(\[|\])/g, '').split(',').map(region => `'${region}'`)}]` : '',
    sectors: filters => filters && filters.sectors.length ? `sectors && ARRAY[${filters.sectors.map(sector => `'${sector}'`).join(', ')}]` : ''
  },
  projects: {
    to:      (filters, timelineDate) => `year='${moment.utc(timelineDate || filters && filters.to).format('YYYY')}'`,
    region:  filters => filters && filters.region ? `iso in (${filters.region.replace(/(\[|\])/g, '').split(',').map(region => `'${region}'`)})` : '',
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

  _getQuery() {
    const filters = this.options.state.filters;
    const timelineDate = this.options.state.timelineDate;
    const layer = this.options.state.layer;
    const statements = optionalStatements[this.options.category];
    const templateWhere = _.indexOf(this.options.sql_template.split(' '), '$WHERE') >= 0 ? true : false;
    const templateYear = _.indexOf(this.options.sql_template.split(' '), '$YEAR') >= 0 ? true : false;

    if (templateWhere) {
      return this.options.sql_template.replace(/\s\$WHERE/g, () => {
        if(filters || timelineDate) {
          const res = Object.keys(statements).map(name => {
            const filter = filters[name];
              if(Array.isArray(filter) && filter.length ||
                !Array.isArray(filter) && filter || timelineDate) {
                return statements[name](filters, timelineDate, layer);
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

    if(templateYear) {
      return this.options.sql_template.replace(/\s\$YEAR/g, () => {
        if(timelineDate || filters && filters['to']) {
          return ` WHERE ${statements['to'](filters, timelineDate)}`;
        }
        return '';
      });
    }
  }

  createLayer() {
    this.options.sql = this._getQuery();
    const cartoAccount = this.options.cartodbAccount;
    const cartoKey = this.options.cartodbKey;
    console.log(this.options.sql)
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
      this.layer = L.tileLayer(tileUrl, { noWrap: true });
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
