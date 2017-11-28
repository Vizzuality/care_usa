'use strict';

import Backbone from 'backbone';

class RegionsCollection extends Backbone.Collection {

  url() {
    return `${config.apiUrl}/countries`;
  }

  comparator(region) {
    return region.name;
  }

};

export default new RegionsCollection();
