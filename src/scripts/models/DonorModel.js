'use strict';

import Backbone from 'backbone';
import CartodbModel from './CartodbModel';

class DonorModel extends CartodbModel {

  constructor(options) {
    super(options);
    const settings = {
      table: 'care_donors',
      query: 'iso=\'USA\''
    }
    this.options = Object.assign(this.defaults, settings);
  }

}

export default DonorModel;
