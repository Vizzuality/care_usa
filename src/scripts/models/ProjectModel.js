'use strict';

import CartodbModel from './CartodbModel';

class ProjectModel extends CartodbModel {

  constructor(options) {
    super(options);
  }

  customFetch(options) {
  	const url = `${config.apiUrl}/projects?lat=${options.latLng.lat}&lng=${options.latLng.lng}`;
  	return this.fetch({ url: url });
  }
}

export default ProjectModel;