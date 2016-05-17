'use strict';

import Backbone from 'backbone';
import _ from 'underscore';
import utils from '../../scripts/helpers/utils';
import moment from 'moment';

class FiltersModel extends Backbone.Model {

  /* We extend the default set method to add a timestamp */
  set(key, val, options) {
    this._timestamp = +(new Date());
    super.set(key, val, options);
  }

  validate(data) {
    let isValid = true;
    const res = {
      errors: [],
      fields: []
    };

    const fromInputNames = [ 'from-day', 'from-month', 'from-year' ];
    const toInputNames = [ 'to-day', 'to-month', 'to-year' ];

    /* If one of the start date filters is filled but not all of them */
    const filledFromInputs = fromInputNames.map(name => data[name] !== null ? name : null)
      .filter(name => name !== null);

    if(filledFromInputs.length > 0 && filledFromInputs.length < 3) {
      isValid = false;
      res.errors.push('Please ensure that you filled all of the start date fields.')
      res.fields = res.fields.concat(_.difference(fromInputNames, filledFromInputs));
    }

    /* If one of the end date filters is filled but not all of them */
    const filledToInputs = toInputNames.map(name => data[name] !== null ? name : null)
      .filter(name => name !== null);

    if(filledToInputs.length > 0 && filledToInputs.length < 3) {
      isValid = false;
      res.errors.push('Please ensure that you filled all of the end date fields.')
      res.fields = res.fields.concat(_.difference(toInputNames, filledToInputs));
    }

    /* If the start date is after the end date */
    if(isValid && filledFromInputs.length === 3 && filledToInputs.length === 3) {
      const startDate = moment.utc(fromInputNames.map(name => data[name]).join('-'), 'D-M-YYYY');
      const endDate = moment.utc(toInputNames.map(name => data[name]).join('-'), 'D-M-YYYY');

      if(!startDate.isBefore(endDate)) {
        isValid = false;
        res.errors.push('Please ensure that the start date is prior to the end one.')
        res.fields = res.fields.concat(toInputNames);
      }
    }

    /* If the start date is set but not the end date, or the contrary */
    if(filledFromInputs.length === 3 && filledToInputs.length === 0 ||
      filledFromInputs.length === 0 && filledToInputs.length === 3) {
      isValid = false;
      res.errors.push('Please ensure that you filled both the start date and end date.');
      res.fields = res.fields.concat(filledFromInputs.length ? toInputNames : fromInputNames);
    }

    res.fields = _.uniq(res.fields);

    if(!isValid) return res;
  }

  filtersIsEmpty() {
    let empty = true;
    const serializedFilters = this.toJSON();
    for(let key in serializedFilters) {
      let filter = serializedFilters[key];
      if(!Array.isArray(filter) && filter ||
        Array.isArray(filter) && filter.length) {
        empty = false;
        break;
      }
    }
    return empty;
  }

}

/* Defaults are necessary to ensure the modal of filters is resetted each time
 * it's reopened. It's used to reset the filters whose changes haven't been
 * applied before closing it. */
FiltersModel.prototype.defaults = {
  'from-day': null,
  'from-month': null,
  'from-year': null,
  'to-day': null,
  'to-month': null,
  'to-year': null,
  region: null,
  sectors: []
};

export default new FiltersModel();
