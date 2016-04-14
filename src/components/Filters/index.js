'use strict';

import Backbone from 'backbone';
import _ from 'underscore';
import moment from 'moment';

import './styles.postcss';
import utils from '../../scripts/helpers/utils';

const defaults = {
  rendered: false
};

class FiltersView extends Backbone.View {

  events() {
    return {
      'click .js-apply': 'onApply',
      'click .js-clear': 'onClear'
    };
  }

  initialize(options) {
    this.options = _.extend(options, defaults);
    this.applyButton = this.el.querySelector('.js-apply');
    this.render();
  }

  render() {
    if(!this.rendered) {
      this.populateDateSelectors();
      this.inputs = this.el.querySelectorAll('input, select');
    }

    if(!this.rendered) this.rendered = true;
  }

  populateDateSelectors() {
    this.$el.find('.js-from-year, .js-to-year')
      .append(() => {
        return [2012, 2013, 2014, 2015].map((year) => {
          return `<option value="${year}">${year}</option>`
        });
      });

    this.$el.find('.js-from-month, .js-to-month')
      .append(() => {
        return moment.months().map((month, index) => {
          return `<option value="${index + 1}">${month}</option>`
        });
      });

    this.$el.find('.js-from-day, .js-to-day')
      .append(() => {
        return _.range(31).map((day) => {
          return `<option value="${day + 1}">${utils.pad(day + 1, 2, '0')}</option>`
        });
      });
  }

  /* Return the serialized form */
  serializeFilters() {
    var serialized = { sectors: [] };

    for(let i = 0, j = this.inputs.length; i < j; i++) {
      const input = this.inputs[i];

      if(utils.matches(input, 'select')) {
        const selectedOption = input.options[input.selectedIndex];

        if(/^(to|from)\-.*/i.test(input.name)) {
          serialized[input.name] = selectedOption.value.length ?
            selectedOption.value : null;
        } else {
          serialized[input.name] = selectedOption.value.length ?
            selectedOption.value : null;
        }
      } else if(/^sector\-.*/i.test(input.name)) {
        if(input.checked) {
          const name = input.name.replace('sector-', '');
          if(serialized.sectors) serialized.sectors.push(name);
          else serialized.sectors = [ name ];
        }
      }
    }

    return serialized;
  }

  resetFilters() {
    for(let i = 0, j = this.inputs.length; i < j; i++) {
      const input = this.inputs[i];

      if(utils.matches(input, 'select')) {
        input.options[input.selectedIndex].selected = false;
        input.options[0].selected = true;
      } else if(/^sector\-.*/i.test(input.name)) {
        input.checked = false;
      }
    }
  }

  /* Return an object with the property valid set to true if the form is valid,
   * errors which is a string of the error messages and fields which is the list
   * of the fields affected by the errors */
  validate(serializedFilters) {
    const res = {
      valid: true,
      errors: [],
      fields: []
    };

    const fromInputNames = [ 'from-day', 'from-month', 'from-year' ];
    const toInputNames = [ 'to-day', 'to-month', 'to-year' ];

    /* If one of the start date filters is filled but not all of them */
    const filledFromInputs = fromInputNames.map(name => serializedFilters[name] !== null ? name : null)
      .filter(name => name !== null);

    if(filledFromInputs.length > 0 && filledFromInputs.length < 3) {
      res.valid = false;
      res.errors.push('Please ensure that you filled all of the start date fields or let them all blank.')
      res.fields = res.fields.concat(_.difference(fromInputNames, filledFromInputs));
    }

    /* If one of the end date filters is filled but not all of them */
    const filledToInputs = toInputNames.map(name => serializedFilters[name] !== null ? name : null)
      .filter(name => name !== null);

    if(filledToInputs.length > 0 && filledToInputs.length < 3) {
      res.valid = false;
      res.errors.push('Please ensure that you filled all of the end date fields or let them all blank.')
      res.fields = res.fields.concat(_.difference(toInputNames, filledToInputs));
    }

    /* If the start date is after the end date */
    if(res.valid && filledFromInputs.length === 3 && filledToInputs.length === 3) {
      const startDate = moment(fromInputNames.map(name => serializedFilters[name]).join('-'), 'D-M-YYYY');
      const endDate = moment(toInputNames.map(name => serializedFilters[name]).join('-'), 'D-M-YYYY');

      if(!startDate.isBefore(endDate)) {
        res.valid = false;
        res.errors.push('Please ensure that the start date is prior to the end one.')
        res.fields = res.fields.concat(toInputNames);
      }
    }

    /* TODO: check that the user enter both the start date and the end date or
     * none of them */

    res.fields = _.uniq(res.fields);

    return res;
  }

  /* TODO: check the available day, month, year depending on the user's choice */

  onApply(e) {
    e.preventDefault();
    const serializedFilters = this.serializeFilters();
    const validation = this.validate(serializedFilters);

    if(!validation.valid) {
      const invalidInputs = [...this.inputs].filter(input => !!~validation.fields.indexOf(input.name));
      for(let i = 0, j = invalidInputs.length; i < j; i++) {
        invalidInputs[i].classList.add('-invalid');
      }
      this.applyButton.classList.add('-invalid');
      /* TODO: show error message */
    }
    else {
      for(let i = 0, j = this.inputs.length; i < j; i++) {
        this.inputs[i].classList.remove('-invalid');
      }
      this.applyButton.classList.remove('-invalid');
      /* TODO: trigger */
    }
    /* TODO: close the modal */
  }

  onClear(e) {
    e.preventDefault();
    this.resetFilters();
    /* TODO: trigger */
    /* TODO: close the modal? */
  }

};

export default FiltersView;
