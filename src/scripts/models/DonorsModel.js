'use strict';

import Backbone from 'backbone';
import CartodbModel from './../helpers/CartodbModel';



class DonorsModel extends CartodbModel {

  constructor(options) {

    super(options);
    this.options = {
      table: 'care_donors',
      query: "iso='USA'"
    }

    this.options = Object.assign(this.defaults, this.options);

  }
};


module.exports = DonorsModel;
