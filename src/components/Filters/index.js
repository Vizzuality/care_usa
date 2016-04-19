'use strict';

import Backbone from 'backbone';
import _ from 'underscore';
import moment from 'moment';
import $ from 'jquery';

import './styles.postcss';
import utils from '../../scripts/helpers/utils';
import SectorsCollection from '../../scripts/collections/SectorsCollection';
import RegionsCollection from '../../scripts/collections/RegionsCollection';

const defaults = {
  rendered: false
};

class FiltersView extends Backbone.View {

  events() {
    return {
      'click .js-apply': 'onApply',
      'click .js-clear': 'onClear',
      'input .js-from-day': 'onDateChange',
      'input .js-from-month': 'onDateChange',
      'input .js-from-year': 'onDateChange',
      'input .js-to-day': 'onDateChange',
      'input .js-to-month': 'onDateChange',
      'input .js-to-year': 'onDateChange'
    };
  }

  initialize(options) {
    this.options = _.extend(options, defaults);
    this.applyButton = this.el.querySelector('.js-apply');
    this.sectorsCollection = new SectorsCollection();
    this.regionsCollection = new RegionsCollection();
    $.when.apply(null, [this.sectorsCollection.fetch(), this.regionsCollection.fetch()])
      .then(this.render.bind(this))
      .fail(() => console.error('Unable to load the list of sectors and/or regions'));
  }

  render() {
    if(!this.rendered) {
      this.populateSelectors();
      this.inputs = this.el.querySelectorAll('input, select');
    }

    if(!this.rendered) this.rendered = true;
  }

  populateSelectors() {
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

    this.$el.find('.js-sectors')
      .append(() => {
        return this.sectorsCollection.toJSON().map((sector) => {
          return `
            <input type="checkbox" id="filters-${sector.slug}" name="sector-${sector.slug}" />
            <label class="text text-cta" for="filters-${sector.slug}">
              ${sector.name}
            </label>
          `;
        });
      });

    this.$el.find('.js-regions')
      .append(() => {
        return this.regionsCollection.toJSON().map((region) => {
          return `
            <option value="${region.iso}">${region.name}</option>
          `;
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

    this.resetErrorState();
    this.resetOptionsAvailability();
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
      res.errors.push('Please ensure that you filled all of the start date fields.')
      res.fields = res.fields.concat(_.difference(fromInputNames, filledFromInputs));
    }

    /* If one of the end date filters is filled but not all of them */
    const filledToInputs = toInputNames.map(name => serializedFilters[name] !== null ? name : null)
      .filter(name => name !== null);

    if(filledToInputs.length > 0 && filledToInputs.length < 3) {
      res.valid = false;
      res.errors.push('Please ensure that you filled all of the end date fields.')
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

    /* If the start date is set but not the end date, or the contrary */
    if(filledFromInputs.length === 3 && filledToInputs.length === 0 ||
      filledFromInputs.length === 0 && filledToInputs.length === 3) {
      res.valid = false;
      res.errors.push('Please ensure that you filled both the start date and end date.');
      res.fields = res.fields.concat(filledFromInputs.length ? toInputNames : fromInputNames);
    }

    res.fields = _.uniq(res.fields);

    return res;
  }

  /* Remove the error message and the error state from the inputs */
  resetErrorState() {
    for(let i = 0, j = this.inputs.length; i < j; i++) {
      this.inputs[i].classList.remove('-invalid');
    }
    this.applyButton.classList.remove('-invalid');
    if(this.el.querySelector('.js-error')) {
      this.el.removeChild(this.el.querySelector('.js-error'));
    }
  }

  onApply(e) {
    e.preventDefault();
    const serializedFilters = this.serializeFilters();
    const validation = this.validate(serializedFilters);

    /* We remove all the visual error elements */
    this.resetErrorState();

    if(!validation.valid) {
      const invalidInputs = [...this.inputs].filter(input => !!~validation.fields.indexOf(input.name));
      for(let i = 0, j = invalidInputs.length; i < j; i++) {
        invalidInputs[i].classList.add('-invalid');
      }
      this.applyButton.classList.add('-invalid');

      let errorHtml = '<div class="error-message js-error">';
      errorHtml += validation.errors.join('<br>');
      errorHtml += '</div>';
      this.$el.prepend(errorHtml);
    }
    else {
      this.triggerFilters();
      this.options.closeCallback();
    }
  }

  onClear(e) {
    e.preventDefault();
    this.resetFilters();
    this.triggerFilters();
  }

  triggerFilters() {
    const serializedFilters = this.serializeFilters();
    if(serializedFilters['from-day']) {
      serializedFilters.from = new Date(`${utils.pad(serializedFilters['from-month'], 2, '0')}-${utils.pad(serializedFilters['from-day'], 2, '0')}-${serializedFilters['from-year']}`);
      serializedFilters.to = new Date(`${utils.pad(serializedFilters['to-month'], 2, '0')}-${utils.pad(serializedFilters['to-day'], 2, '0')}-${serializedFilters['to-year']}`);
    }
    delete serializedFilters['from-day'];
    delete serializedFilters['from-month'];
    delete serializedFilters['from-year'];
    delete serializedFilters['to-day'];
    delete serializedFilters['to-month'];
    delete serializedFilters['to-year'];
    this.options.saveCallback(serializedFilters);
  }

  onDateChange(e) {
    const input = e.currentTarget;
    const dateType = /from/.test(input.classList[0]) ? 'from' : 'to';
    const serializedFilters = this.serializeFilters();

    const day = serializedFilters[`${dateType}-day`];
    const month = serializedFilters[`${dateType}-month`];
    const year = serializedFilters[`${dateType}-year`];

    /* We remove all the disabled options */
    if(!month && !day) {
      this.$el.find(`.js-${dateType}-day option`)
        .attr('disabled', function() { return !this.value; });
      this.$el.find(`.js-${dateType}-month option`)
        .attr('disabled', function() { return !this.value; });
      this.$el.find(`.js-${dateType}-year option`)
        .attr('disabled', function() { return !this.value; });
    }

    /* We filter the available options for the years */
    if(month && day) {
      this.$el.find(`.js-${dateType}-year option`)
        .attr('disabled', function() {
          const date = moment(`${this.value}-${utils.pad(month, 2, '0')}-${utils.pad(day, 2, '0')}`, 'YYYY-MM-DD');
          return !this.value || !date.isValid();
        });
    }

    /* We filter the available options for the months */
    if(day) {
      /* 2016 is a year with 29 days in February */
      const year = this.$el.find(`.js-${dateType}-year option:selected`).val() || '2016';

      this.$el.find(`.js-${dateType}-month option`)
        .attr('disabled', function() {
          const date = moment(`${year}-${utils.pad(this.value, 2, '0')}-01`, 'YYYY-MM-DD');
          return !this.value || date.daysInMonth() < +day;
        });
    }

    /* We filter the available options for the days */
    if(month) {
      /* 2016 is a year with 29 days in February */
      const year = this.$el.find(`.js-${dateType}-year option:selected`).val() || '2016';

      this.$el.find(`.js-${dateType}-day option`)
        .attr('disabled', function() {
          const date = moment(`${year}-${utils.pad(month, 2, '0')}-${utils.pad(this.value, 2, '0')}`, 'YYYY-MM-DD');
          return !this.value || !date.isValid();
        });
    }
  }

  resetOptionsAvailability() {
    for(let dateType of ['from', 'to']) {
      this.$el.find(`.js-${dateType}-day option`)
        .attr('disabled', function() { return !this.value; });
      this.$el.find(`.js-${dateType}-month option`)
        .attr('disabled', function() { return !this.value; });
      this.$el.find(`.js-${dateType}-year option`)
        .attr('disabled', function() { return !this.value; });
    }
  }

};

export default FiltersView;
