'use strict';

import Backbone from 'backbone';
import config from '../../config';

class SectorsCollection extends Backbone.Collection {

  url() {
    return `${config.apiUrl}/sectors`;
  }

};

export default new SectorsCollection();
