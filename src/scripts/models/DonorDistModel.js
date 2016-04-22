'use strict';

import CartodbModel from './CartodbModel';

class DonorsDistModel extends CartodbModel {

  constructor(options) {
    super(options);
  }

  customFetch(options) {
  	const url = `${config.apiUrl}/donations/distribution?lat=${options.latLng.lat}&lng=${options.latLng.lng}`;
  	return this.fetch({ url: url });
  }
}

export default DonorsDistModel;
