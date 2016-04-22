'use strict';

import CartodbModel from './CartodbModel';

class DonorModel extends CartodbModel {

  constructor(options) {
    super(options);
    const settings = {
      table: 'donors',
      query: 'iso=\'USA\''
    }
    this.options = Object.assign(this.defaults, settings);
  }

}

export default DonorModel;
