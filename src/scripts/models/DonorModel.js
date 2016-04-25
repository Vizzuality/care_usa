'use strict';

import CartodbModel from './CartodbModel';

class DonorModel extends CartodbModel {

  constructor(options) {
    super(options);
  }

  // customFetch(options) {
  // 	const url = `${config.apiUrl}/donations?lat=${options.latLng.lat}&lng=${options.latLng.lng}`;
  // 	return this.fetch({ url: url });
  // }
}

export default DonorModel;
