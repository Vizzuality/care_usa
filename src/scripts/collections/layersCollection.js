'use strict';

import Backbone from 'backbone';

class LayersCollection extends Backbone.Collection {

  url() {
    return `${config.apiUrl}/layers`;
  }

}

export default new LayersCollection();
