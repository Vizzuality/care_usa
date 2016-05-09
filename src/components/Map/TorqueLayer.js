'use strict';

import $ from 'jquery';
import moment from 'moment';
import utils from '../../scripts/helpers/utils';

/**
 * Here is the custom AnimatorStepsRange we use to override a non-desired
 * behavior of Torque's library.
 * Source: https://github.com/CartoDB/torque/blob/31a81e760b249e76b159c9966c219ae570f9acb3/dist/torque.full.uncompressed.js#L5
 */
const CustomAnimatorStepsRange = function(start, end) {
  if (start < 0) throw new Error('start must be a positive number');
  /* The only change is on the next line where ">=" has been replaced by ">" */
  if (start > end) throw new Error('start must be smaller than end');
  this.start = start;
  this.end = end;
};
CustomAnimatorStepsRange.prototype = {
  diff: function() { return this.end - this.start; },
  isLast: function(step) { return (step | 0) === this.end; }
};

/* Here are the concrete methods we override */
const steps = function(_) {
  this.options.steps = _;
  this._defaultStepsRange = new CustomAnimatorStepsRange(0, _);
  return this.rescale();
};
const stepsRange = function(start, end) {
  if (arguments.length === 2) {
    if (start < this._defaultStepsRange.start) throw new Error('start must be within default steps range');
    if (end > this._defaultStepsRange.end) throw new Error('end must be within default steps range');
    this._customStepsRange = new CustomAnimatorStepsRange(start, end);
    this.options.onStepsRange && this.options.onStepsRange();
    var step = this.step() | 0;
    if (step < start || step > end) {
      this.step(start);
    }
  }
  return this._customStepsRange || this._defaultStepsRange;
};

const optionalStatements = {
  donations: {
    from:    (filters, range) => `date > '${range[0].format('MM-DD-YYYY')}'::date`,
    to:      (filters, range) => `date < '${range[1].format('MM-DD-YYYY')}'::date`,
    region:  filters => filters && filters.region ? `countries @> '%${filters.region}%'` : '',
    sectors: filters => filters && filters.sectors.length ? `sectors && ARRAY[${filters.sectors.map(sector => `'${sector}'`).join(', ')}]` : ''
  }
};

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

    /* When CartoDB returns no data from the table, Torque throws an error
     * which can't be caught instead of triggering an event. As we don't wan't
     * an error to be displayed for such a case, we override the method which
     * causes the error. */
    this.layer.animator.steps = steps;
    this.layer.animator.stepsRange = stepsRange;

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
    const statements = optionalStatements[this.options.category]
    return this.options.sql_template.replace('$WHERE', () => {
      if(filters) {
        const res = Object.keys(statements).map(name => {
          const filter = filters[name];
            return statements[name](filters, [
              moment.utc(this.state.layer.domain[0], 'YYYY-MM-DD'),
              moment.utc(this.state.layer.domain[1], 'YYYY-MM-DD')
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
    /* FF has some huge performance issues to render the Torque layer with some
     * properties of the CartoCSS. We then decided to prioritize the rendering
     * of the layer over it's visual aspect. Removing the multiply blending mode
     * permits the app to load and work on FF on Windows even if it's visually
     * not ideal. Until another fix is found, this should stay like that. */
    return utils.isFF() ?
      this.options.geo_cartocss.replace('comp-op: multiply;', '') :
      this.options.geo_cartocss;
  }

  isReady() {
    return !Number.isNaN(this.layer.timeToStep(new Date()));
  }

}

export default TorqueLayer;
