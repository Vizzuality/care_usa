'use strict';

import Backbone from 'backbone';
import _ from 'underscore';
import utils from '../../scripts/helpers/utils';

class FiltersModel extends Backbone.Model {

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
    if(res.valid && filledFromInputs.length === 3 && filledToInputs.length === 3) {
      const startDate = moment(fromInputNames.map(name => data[name]).join('-'), 'D-M-YYYY');
      const endDate = moment(toInputNames.map(name => data[name]).join('-'), 'D-M-YYYY');

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

}

export default FiltersModel;
