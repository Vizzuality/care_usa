'use strict';

import Backbone from 'backbone';
import _ from 'underscore';

import './styles.postcss';

const defaults = {};

class FiltersView extends Backbone.View {

  initialize(options) {
    this.options = _.extend(options, defaults);
  }

};

export default FiltersView;
