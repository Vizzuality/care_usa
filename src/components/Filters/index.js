'use strict';

import Backbone from 'backbone';
import _ from 'underscore';
import moment from 'moment';
import $ from 'jquery';
import select2 from 'select2';

import './styles.postcss';
import filtersModel from '../../scripts/models/filtersModel';
import utils from '../../scripts/helpers/utils';
import sectorsCollection from '../../scripts/collections/SectorsCollection';
import regionsCollection from '../../scripts/collections/RegionsCollection';

const defaults = {
  rendered: false
};

class FiltersView extends Backbone.View {

  events() {
    return {
      'click .js-apply': 'onApply',
      'click .js-clear': 'onClear',
      'change .js-from-day': 'onDateChange',
      'change .js-from-month': 'onDateChange',
      'change .js-from-year': 'onDateChange',
      'change .js-to-day': 'onDateChange',
      'change .js-to-month': 'onDateChange',
      'change .js-to-year': 'onDateChange',
      'change input[type="checkbox"]': 'onInputChange',
      'change select': 'onInputChange'
    };
  }

  initialize(options) {
    this.options = _.extend(options, defaults);
    this.status = filtersModel;
    this.applyButton = this.el.querySelector('.js-apply');
    this.clearButton = this.el.querySelector('.js-clear');
    this.availableRange = this.el.querySelector('.js-available-range');
    this.sectorsCollection =  sectorsCollection;
    this.regionsCollection = regionsCollection;
    this.rendered = false;

    this.initFiltersModel();

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

  initFiltersModel() {
    if(this.options.initialFilters.from) {
      const date = moment.utc(this.options.initialFilters.from)
        .format('MM:DD:YYYY');

      /* Google Analytics */
      ga && ga('send', 'event', 'Settings', 'Start date', date);
    }

    if(this.options.initialFilters.to) {
      const date = moment.utc(this.options.initialFilters.to)
        .format('MM:DD:YYYY');

      /* Google Analytics */
      ga && ga('send', 'event', 'Settings', 'End date', date);
    }

    if(this.options.initialFilters.region) {
      const regionModel = this.regionsCollection.findWhere({
        iso: this.options.initialFilters.region
      });

      if(regionModel) {
        const region = regionModel.attributes.name;

        /* Google Analytics */
        ga && ga('send', 'event', 'Settings', 'Country', region);
      }
    }

    if(this.options.initialFilters.sectors &&
      this.options.initialFilters.sectors.length) {
      this.options.initialFilters.sectors.forEach(sector => {
        const sectorModel = this.sectorsCollection.findWhere({ slug: sector });
        if(sectorModel) {
          const sectorName = sectorModel.attributes.name;

          /* Google Analytics */
          ga && ga('send', 'event', 'Settings', 'Sector', sectorName);
        }
      })
    }

    filtersModel.set(this.options.initialFilters);
  }

  render() {
    if(!this.rendered) {
      this.populateSelectors();
      this.renderAvailableRange();
      this.inputs = this.el.querySelectorAll('input, select');
      this.applySelect2();
    }

    if(!this.rendered) this.rendered = true;
  }

  renderAvailableRange() {
    const startDate = moment.utc(this.options.domain[0]).format('MM·DD·YYYY');
    const endDate = moment.utc(this.options.domain[1]).format('MM·DD·YYYY');
    this.availableRange.innerHTML = `Available dates <span>from ${startDate} to ${endDate}</span>`;
  }

  updateAvailableRange(domain) {
    this.options.domain = domain;
    this.renderAvailableRange();
  }

  applySelect2() {
    [...this.inputs].filter(input => utils.matches(input, 'select'))
      .forEach(select => {
        $(select).select2({
          placeholder: select.options[0].textContent,
          minimumResultsForSearch: select.classList.contains('js-regions') ? 0 : Infinity
        });
      });
  }

  /* Set the state of the form elements as stored in this.status */
  updateFilters() {
    if(!this.rendered) return;

    const status = this.status.toJSON();
    for(let key in status) {
      /* Keys "from" and "to" don't match any select or checkbox, they are
       * virtual keys used by the rest of the app */
      if(key === 'from' || key === 'to') continue;

      const value = status[key];

      if(/^((from|to).*|region)/.test(key)) {

        /* The filter is a select input */
        const select = this.el.querySelector(`select[name="${key}"]`);

        select.options[select.selectedIndex].selected = false;

        if(!value) {
          select.options[0].selected = true;
          $(select).trigger('change.select2');
        } else {
          let found = false;
          for(let i = 0, j = select.options.length; i < j; i++) {
            if(select.options[i].value === value) {
              found = true;
              select.options[i].selected = true;
              $(select).trigger('change.select2');
              break;
            }
          }

          /* In case we couldn't find the value, it's probably because it came
           * from outside of the app and is incorrect, we then remove it */
          if(!found) {
            const o = {};
            o[key] = null;
            filtersModel.set(o);
          }
        }

      } else {

        /* The filter is sectors, the checkboxes */
        const checkboxes = this.el.querySelectorAll(`.js-sectors input[type="checkbox"]`);

        /* We reset all the checboxes */
        for(let i = 0, j = checkboxes.length; i < j; i++) {
          checkboxes[i].checked = false;
        }

        let unfoundSectors = [];

        for(let i = 0, j = value.length; i < j; i++) {
          let found = false;

          for(let k = 0, l = checkboxes.length; k < l; k++) {
            if(checkboxes[k].name.replace('sector-', '') === value[i]) {
              checkboxes[k].checked = true;
              found = true;
              break;
            }
          }

          if(!found) unfoundSectors.push(value[i]);
        }

        /* If some sectors couldn't be found, we remove them as they probably
         * come from outside of the app (router for example) */
        if(unfoundSectors.length) {
          filtersModel.set({
            sectors: _.difference(value, unfoundSectors)
          });
        }


      }
    }

    this.checkButtonsAvailability();
  }

  populateSelectors() {
    this.$el.find('.js-from-year, .js-to-year')
      .append(() => {
        return this.getYearRange().map((year) => {
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

  /* Return an array of the available years for the date filters */
  getYearRange() {
    const startDate = moment.utc(this.options.wholeDomain[0]);
    const endDate   = moment.utc(this.options.wholeDomain[1]);
    return _.range(startDate.year(), endDate.year() + 1);
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
  }

  /* Update the status model with the serialized form */
  setStatus() {
    const serializedFilters = this.serializeFilters();

    if(serializedFilters['from-day'] && serializedFilters['from-month'] &&
      serializedFilters['from-year']) {
      serializedFilters.from = new Date(`${serializedFilters['from-year']}-${utils.pad(serializedFilters['from-month'], 2, '0')}-${utils.pad(serializedFilters['from-day'], 2, '0')}`);
    } else {
      /* We need to silently remove the property "from" which isns't
       * present in the object serializedFilters as it's virtual */
      this.status.unset('from', { silent: true });
    }

    if(serializedFilters['to-day'] && serializedFilters['to-month'] &&
      serializedFilters['to-year']) {
      serializedFilters.to = new Date(`${serializedFilters['to-year']}-${utils.pad(serializedFilters['to-month'], 2, '0')}-${utils.pad(serializedFilters['to-day'], 2, '0')}`);
    } else {
      /* We need to silently remove the property "to" which isns't
       * present in the object serializedFilters as it's virtual */
      this.status.unset('to', { silent: true });
    }

    this.status.set(serializedFilters, { validate: true });
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
        $(input).trigger('change.select2');
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
    const selects2 = this.el.getElementsByClassName('select2-container--default');

    for(let i = 0, j = selects2.length; i < j; i++) {
      selects2[i].classList.remove('-invalid');
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
    const selects2 = this.el.getElementsByClassName('select2-container--default');

    const validationError = this.status.validationError;
    if(validationError) {
      const invalidInputs = [...this.inputs].filter(input => !!~validationError.fields.indexOf(input.name));
      const invalidSelects = [...selects2].filter(select2 => {
        const name = select2.querySelector('span').querySelector('span').getAttribute('aria-labelledby');
        for(let i = 0; i < validationError.fields.length; i++) {
          if(!!~name.indexOf(validationError.fields[i])) {
            return true;
          }
        }
      });

      for(let i = 0, j = invalidInputs.length; i < j; i++) {
        invalidSelects[i].classList.add('-invalid');
      }
      this.applyButton.classList.add('-invalid');

      let errorHtml = '<div class="error-message js-error">';
      errorHtml += validationError.errors.join('<br>');
      errorHtml += '</div>';
      this.$el.prepend(errorHtml);
    }
    else {
      const updatedFilters = this.status.changedAttributes();

      for(let filter in updatedFilters) {
        if(filter === 'from') {
          const date = moment.utc(updatedFilters.from)
            .format('MM:DD:YYYY');

          /* Google Analytics */
          ga && ga('send', 'event', 'Settings', 'Start date', date);
        }

        if(filter === 'to') {
          const date = moment.utc(updatedFilters.to)
            .format('MM:DD:YYYY');

          /* Google Analytics */
          ga && ga('send', 'event', 'Settings', 'End date', date);
        }

        if(filter === 'region') {
          const regionModel = this.regionsCollection.findWhere({
            iso: updatedFilters.region
          });

          if(regionModel) {
            const region = regionModel.attributes.name;

            /* Google Analytics */
            ga && ga('send', 'event', 'Settings', 'Country', region);
          }
        }

        if(filter === 'sectors') {
          const previousSectors = this.status.previous('sectors');
          const updatedSectors = updatedFilters.sectors;
          const newSectors = _.difference(updatedSectors, previousSectors);

          newSectors.forEach(sector => {
            const sectorModel = this.sectorsCollection.findWhere({ slug: sector });
            if(sectorModel) {
              const sectorName = sectorModel.attributes.name;

              /* Google Analytics */
              ga && ga('send', 'event', 'Settings', 'Sector', sectorName);
            }
          });
        }
      }

      this.options.closeCallback();
    }

    /* Google Analytics */
    ga && ga('send', 'event', 'Settings', 'Menu', 'Apply filters');
  }

  onClear(e) {
    e.preventDefault();
    this.resetFilters();

    /* Google Analytics */
    ga && ga('send', 'event', 'Settings', 'Menu', 'Clear filters');
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
        .attr('disabled', function() { return !this.value; })
        .trigger('change.select2');
      this.$el.find(`.js-${dateType}-month option`)
        .attr('disabled', function() { return !this.value; })
        .trigger('change.select2');
      this.$el.find(`.js-${dateType}-year option`)
        .attr('disabled', function() { return !this.value; })
        .trigger('change.select2');
    }

    /* We filter the available options for the years */
    if(month && day) {
      this.$el.find(`.js-${dateType}-year option`)
        .attr('disabled', function() {
          const date = moment.utc(`${this.value}-${utils.pad(month, 2, '0')}-${utils.pad(day, 2, '0')}`, 'YYYY-MM-DD');
          return !this.value || !date.isValid();
        })
        .trigger('change.select2');
    }

    /* We filter the available options for the months */
    if(day) {
      /* 2016 is a year with 29 days in February */
      const year = this.$el.find(`.js-${dateType}-year option:selected`).val() || '2016';

      this.$el.find(`.js-${dateType}-month option`)
        .attr('disabled', function() {
          const date = moment.utc(`${year}-${utils.pad(this.value, 2, '0')}-01`, 'YYYY-MM-DD');
          return !this.value || date.daysInMonth() < +day;
        })
        .trigger('change.select2');
    }

    /* We filter the available options for the days */
    if(month) {
      /* 2016 is a year with 29 days in February */
      const year = this.$el.find(`.js-${dateType}-year option:selected`).val() || '2016';

      this.$el.find(`.js-${dateType}-day option`)
        .attr('disabled', function() {
          const date = moment.utc(`${year}-${utils.pad(month, 2, '0')}-${utils.pad(this.value, 2, '0')}`, 'YYYY-MM-DD');
          return !this.value || !date.isValid();
        })
        .trigger('change.select2');
    }
  }

  resetOptionsAvailability() {
    for(let dateType of ['from', 'to']) {
      this.$el.find(`.js-${dateType}-day option`)
        .attr('disabled', function() { return !this.value; })
        .trigger('change.select2');
      this.$el.find(`.js-${dateType}-month option`)
        .attr('disabled', function() { return !this.value; })
        .trigger('change.select2');
      this.$el.find(`.js-${dateType}-year option`)
        .attr('disabled', function() { return !this.value; })
        .trigger('change.select2');
    }
  }

};

export default FiltersView;
