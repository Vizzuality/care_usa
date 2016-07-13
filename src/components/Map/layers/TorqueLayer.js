'use strict';

import $ from 'jquery';
import utils from '../../../scripts/helpers/utils';
import _ from 'underscore';
import moment from 'moment';

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
    from:    (filters, range) => `date >= '${range[0].format('MM-DD-YYYY')}'::date`,
    to:      (filters, range) => `date <= '${range[1].format('MM-DD-YYYY')}'::date`,
    region:  filters => filters && filters.region ? `countries @> ARRAY[${filters.region.replace(/(\[|\])/g, '').split(',').map(region => `'${region}'`)}]` : '',
    sectors: filters => filters && filters.sectors.length ? `sectors && ARRAY[${filters.sectors.map(sector => `'${sector}'`).join(', ')}]` : ''
  }
};

export default class TorqueLayer {

  constructor(options, state) {
    this.options = Object.assign({}, options);
    this.options.state = state;
    this.timestamp = +(new Date());
  }

  /**
   * Return the query used to fetch the layer
   * @return {String} SQL query
   */
   getQuery() {
    const filters = this.options.state.filters;
    const statements = optionalStatements[this.options.category]
    return this.options.sql_template.replace('$WHERE', () => {
      const res = Object.keys(statements).map(name => {
        return statements[name](filters, [
          moment.utc(this.options.state.layer.domain[0], 'YYYY-MM-DD'),
          moment.utc(this.options.state.layer.domain[1], 'YYYY-MM-DD')
        ]);
      }).filter(statement => !!statement)
        .join(' AND ');

      if(res.length) {
        return (this.options.category === 'donations' ? 'WHERE ' : 'AND ') + res;
      }
     return '';
    });
  }

  /**
   * Init the layer and return a deferred Object
   * @return {Object} jQuery deferred object
   */
  initLayer() {
    const deferred = $.Deferred();

    this.layer = new L.TorqueLayer({
      user: config.cartodbAccount,
      table: this.options.tablename || 'donors',
      sql: this.getQuery(),
      provider: 'sql_api',
      cartocss: this.getCartoCSS(),
      steps: this.getSteps(),
      valueDataType: Uint16Array // it allows values greater than 256
    });

    /* When CartoDB returns no data from the table, Torque throws an error
     * which can't be caught instead of triggering an event. As we don't wan't
     * an error to be displayed for such a case, we override the method which
     * causes the error. */
    this.layer.animator.steps = steps;
    this.layer.animator.stepsRange = stepsRange;

    this.layer.error(deferred.reject);
    deferred.resolve(this.layer);

    /* Hack to get to know when a torque layer has been loaded as there's no
     * proper "loaded" working event in the torque library */
    const callback = () => {
      if(!this.hasData()) {
        clearTimeout(timeout);
        return;
      }

      if(this.isReady()) {
        clearTimeout(timeout);
        this.setPosition();
      }
    };
    const timeout = setInterval(callback.bind(this), 200);

    return deferred;
  }

  /**
   * Set the step of the layer
   */
  setPosition() {
    const currentDate = this.options.state.timelineDate
      || this.options.state.filters.to;
    const step = Math.round(this.layer.timeToStep(+new Date(currentDate)));
    this.layer.setStep(step);
  }

  /**
   * Calculating steps by layerSpec
   * @return {Number}
   */
  getSteps() {
    var unit = this.options.state.layer.timeline.interval.unit || 'month';
    var interval = this.options.state.layer.timeline.interval.count || 1;
    var startDate = moment.utc(this.options.state.layer.domain[0], 'YYYY-MM-DD').valueOf();
    var endDate = moment.utc(this.options.state.layer.domain[1], 'YYYY-MM-DD').valueOf();
    // Using d3 time interval, more info: https://github.com/d3/d3/wiki/Time-Intervals
    var numberOfSteps = d3.time[unit + 's'](startDate, endDate, interval);
    return numberOfSteps.length || 1;
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

  /* Return true if the layer displays data */
  hasData() {
    /* This is a hack: in case CartoDB doesn't return any data, there's no step
     * so start === end === 0 */
    return !(this.layer.animator._defaultStepsRange.start === this.layer.animator._defaultStepsRange.end &&
      this.layer.animator._defaultStepsRange.start === 0);
  }

  /**
   * Return true if the layer should be reloaded due to new params
   * @param  {Object} oldState old state of the map and the application
   * @param  {Object} state    new state
   * @return {Boolean}         true if should be reloaded, false otherwise
   */
  shouldLayerReload(oldState, state) {
    return oldState.filters.timestamp !== state.filters.timestamp &&
      (!_.isEqual(oldState.filters.sectors, state.filters.sectors) ||
        oldState.filters.region !== state.filters.region);
  }

  openPopup() {
    /* TODO */
  }

  closePopup() {
    /* TODO */
  }

  /**
   * Update the layer according to new state
   */
  updateLayer(state) {
    this.options.state = state;
    this.setPosition();
  }

}
