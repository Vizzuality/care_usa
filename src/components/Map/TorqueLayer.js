'use strict';

import $ from 'jquery';
import moment from 'moment';

const optionalStatements = {
  donations: {
    from:    (filters, range) => `date > '${moment.utc(range[0]).format('MM-DD-YYYY')}'::date`,
    to:      (filters, range) => `date < '${moment.utc(range[1]).format('MM-DD-YYYY')}'::date`,
    region:  filters => filters && filters.region ? `countries @> '%${filters.region}%'` : '',
    sectors: filters => filters && filters.sectors.length ? `sectors && ARRAY[${filters.sectors.map(sector => `'${sector}'`).join(', ')}]` : ''
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
    return this.options.sql_template.replace('$WHERE', () => {
      if(filters || timeline) {
        const res = Object.keys(statements).map(name => {
          const filter = filters[name];
            return statements[name](filters, [
              moment.utc(this.options.domain[0], 'YYYY-MM-DD'),
              moment.utc(this.options.domain[1], 'YYYY-MM-DD')
            ]);
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

  isReady() {
    return !Number.isNaN(this.layer.timeToStep(new Date()));
  }

}

export default TorqueLayer;
