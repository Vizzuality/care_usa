'use strict';

import Backbone from 'backbone';
import config from '../../config';

class RegionsCollection extends Backbone.Collection {

  url() {
    return `${config.apiUrl}/countries`;
  }

  comparator(region) {
    return region.name;
  }

};

export default RegionsCollection;
