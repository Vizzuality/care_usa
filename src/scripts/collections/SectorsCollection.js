'use strict';

import Backbone from 'backbone';

class SectorsCollection extends Backbone.Collection {

  url() {
    return `${config.apiUrl}/sectors`;
  }

};

export default new SectorsCollection();
