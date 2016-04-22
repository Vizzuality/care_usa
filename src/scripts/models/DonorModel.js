'use strict';

import CartodbModel from './CartodbModel';

class DonorModel extends CartodbModel {

  constructor(options) {
    super(options);
    const settings = {
      table: 'donors',
      query: 'iso=\'USA\''
    }
    // this.options = Object.assign(this.defaults, settings, options);
  }

  customFetch(options) {
  	console.log('model', options);
  	const url = `${config.apiUrl}/donations?lat=${options.latLng.lat}&lng=${options.latLng.lng}`;
  	console.log(url);
  	return this.fetch({ url: url });
  }


}

export default DonorModel;
