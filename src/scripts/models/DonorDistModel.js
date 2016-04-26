'use strict';

import PopUpModel from './PopUpModel';


class DonorsDistModel extends PopUpModel {

  constructor(options) {
    super(options);
  }

  // customFetch(options) {
  // 	const url = `${config.apiUrl}/donations/distribution?lat=${options.latLng.lat}&lng=${options.latLng.lng}`;
  // 	return this.fetch({ url: url });
  // }
}

export default DonorsDistModel;
