'use strict';

import Backbone from 'backbone';
import _ from 'underscore';
import moment from 'moment';
import $ from 'jquery';

import './styles.postcss';
import filtersModel from '../../scripts/models/filtersModel';
import utils from '../../scripts/helpers/utils';
import sectorsCollection from '../../scripts/collections/sectorsCollection';
import regionsCollection from '../../scripts/collections/regionsCollection';

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
      'input .js-to-year': 'onDateChange',
      'change input[type="checkbox"]': 'onInputChange',
      'input select': 'onInputChange'
    };
  }

  initialize(options) {
    this.options = _.extend(options, defaults);
    this.status = filtersModel;
    this.applyButton = this.el.querySelector('.js-apply');
    this.clearButton = this.el.querySelector('.js-clear');
    this.sectorsCollection =  sectorsCollection;
    this.regionsCollection = regionsCollection;
    this.rendered = false;
    $.when.apply(null, [this.sectorsCollection.fetch(), this.regionsCollection.fetch()])
      .then(() => {
        this.render();
        this.updateFilters();
      })
      .fail(() => console.error('Unable to load the list of sectors and/or regions'));
    this.setListeners();
  }

  setListeners() {
    this.status.on('change', this.updateFilters.bind(this));
  }

  render() {
    if(!this.rendered) {
      this.populateSelectors();
      this.inputs = this.el.querySelectorAll('input, select');
    }

    if(!this.rendered) this.rendered = true;
  }

  /* Set the state of the form elements as stored in this.status */
  updateFilters() {
    if(!this.rendered) return;

    const status = this.status.toJSON();
    for(let key in status) {
      const value = status[key];

      if(/^((from|to).*|region)/.test(key)) {

        /* The filter is a select input */
        const select = this.el.querySelector(`select[name="${key}"]`);

        select.options[select.selectedIndex].selected = false;

        if(!value) {
          select.options[0].selected = true;
        } else {
          for(let i = 0, j = select.options.length; i < j; i++) {
            if(select.options[i].value === value) {
              select.options[i].selected = true;
              break;
            }
          }
        }

      } else {

        /* The filter is sectors, the checkboxes */
        const checkboxes = this.el.querySelectorAll(`.js-sectors input[type="checkbox"]`);

        for(let i = 0, j = checkboxes.length; i < j; i++) {
          checkboxes[i].checked = value.length &&
            !!~value.indexOf(checkboxes[i].name.replace('sector-', ''))
        }
      }
    }

    this.checkButtonsAvailability();
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

  onInputChange() {
    this.checkButtonsAvailability();
  }

  /* We check whether the user activated/chose a filter to decide if we enable
   * the clear and apply buttons */
  checkButtonsAvailability() {
    let empty = true;
    const serializedFilters = this.serializeFilters();
    for(let key in serializedFilters) {
      let filter = serializedFilters[key];
      if(!Array.isArray(filter) && filter ||
        Array.isArray(filter) && filter.length) {
        empty = false;
        break;
      }
    }
    this.toggleButtonsAvailability(!empty);
  }

  /* Update the status model with the serialized form */
  setStatus() {
    const serializedFilters = this.serializeFilters();

    if(serializedFilters['from-day'] && serializedFilters['from-month'] &&
      serializedFilters['from-year']) {
      serializedFilters.from = new Date(`${serializedFilters['from-year']}-${utils.pad(serializedFilters['from-month'], 2, '0')}-${utils.pad(serializedFilters['from-day'], 2, '0')}`);
    }

    if(serializedFilters['to-day'] && serializedFilters['to-month'] &&
      serializedFilters['to-year']) {
      serializedFilters.to = new Date(`${serializedFilters['to-year']}-${utils.pad(serializedFilters['to-month'], 2, '0')}-${utils.pad(serializedFilters['to-day'], 2, '0')}`);
    }

    this.status.clear({ silent: true });
    this.status.set(serializedFilters, { validate: true });
  }

  /* Toggle the availability of the buttons, force it to the "visible" value if
   * present */
  toggleButtonsAvailability(...visible) {
    if(!visible.length) {
      this.applyButton.classList.toggle('is-disabled');
      this.clearButton.classList.toggle('is-disabled');
    } else {
      this.applyButton.classList.toggle('is-disabled', !visible[0]);
      this.clearButton.classList.toggle('is-disabled', !visible[0]);
    }
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
    this.setStatus();
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

    this.setStatus();

    /* We remove all the visual error elements */
    this.resetErrorState();

    /* We can't use this.status.isValid() here because in case we try to set the
     * model with invalid attributes, the model is not set, and then, at the
     * time of calling isValid, the model will be valid because of its old
     * state. Nevertheless, this.status.validationError is set to the value
     * returned by the validate method (on the model) ie. or contain the error
     * object or nothing if set was successful. */
    const validationError = this.status.validationError;
    if(validationError) {
      const invalidInputs = [...this.inputs].filter(input => !!~validationError.fields.indexOf(input.name));
      for(let i = 0, j = invalidInputs.length; i < j; i++) {
        invalidInputs[i].classList.add('-invalid');
      }
      this.applyButton.classList.add('-invalid');

      let errorHtml = '<div class="error-message js-error">';
      errorHtml += validationError.errors.join('<br>');
      errorHtml += '</div>';
      this.$el.prepend(errorHtml);
    }
    else {
      this.options.closeCallback();
    }
  }

  onClear(e) {
    e.preventDefault();
    this.resetFilters();
    this.toggleButtonsAvailability(false);
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
