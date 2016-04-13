'use strict';

import Backbone from 'backbone';
import _ from 'underscore';
import moment from 'moment';

import './styles.postcss';

const defaults = {
  rendered: false
};

class FiltersView extends Backbone.View {

  initialize(options) {
    this.options = _.extend(options, defaults);
    this.render();
  }

  render() {
    if(!this.rendered) {
      this.populateDateSelectors();
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
          return `<option value="${index}">${month}</option>`
        });
      });

    this.$el.find('.js-from-day, .js-to-day')
      .append(() => {
        return _.range(31).map((day) => {
          return `<option value="${day + 1}">${day + 1}</option>`
        });
      });
  }

};

export default FiltersView;
