'use strict';

import $ from 'jquery';
import moment from 'moment';

const optionalStatements = {
  donations: {
    from:    (filters, timeline) => `date > '${moment(filters && filters.from || timeline.from).format('MM-DD-YYYY')}'::date`,
    to:      (filters, timeline) => `date < '${moment(filters && filters.to || timeline.to).format('MM-DD-YYYY')}'::date`,
    region:  filters => filters && filters.region ? `countries like '%${filters.region}%'` : '',
    sectors: filters => filters && filters.sectors.length ? `sectors in (${filters.sectors.map(sector => `'${sector}'`).join(', ')})` : ''
  }
};

/**
 * doc: http://docs.cartodb.com/cartodb-platform/torque/torquejs-getting-started/
 */
class TorqueLayer {

  constructor(options, state) {
    this.options = options;
    this.state = state;
    this.timestamp = new Date().getTime();
  }

  createLayer() {
    const deferred = new $.Deferred();

    // Creating torque layer
    this.layer = new L.TorqueLayer({
      user: config.cartodbAccount,
      table: this.options.tablename || 'donors',
      sql: this.getQuery(),
      cartocss: this.getCartoCSS()
    });

    this.layer.error((err) => {
      console.error(err);
    });

    deferred.resolve(this.layer);

    return deferred.promise();
  }

  /**
   * Add layer to map
   * @param  {L.Map} map
   * @param {Function} callback
   */
  addLayer(map) {
    if (!map) {
      throw new Error('map param is required');
    }
    map.addLayer(this.layer);
  }

  /**
   * Remove layer from map
   * @param  {L.Map} map
   */
  removeLayer(map) {
    if (map && this.layer) {
      map.removeLayer(this.layer);
    }
  }

  getQuery() {
    const filters = this.state.filters;
    const timeline = this.state.timelineDates;
    const statements = optionalStatements[this.options.category]
    return this.options.geo_query.replace('$WHERE', () => {
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

  getCartoCSS() {
    return this.options.geo_cartocss;
  }

}

export default TorqueLayer;
