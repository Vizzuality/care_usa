'use strict';

import Backbone from 'backbone';
import config from './../../config';

class LayersCollection extends Backbone.Collection {

  initialize() {

  };
}

LayersCollection.prototype.url = config.apiUrl + '/layers';

export default new LayersCollection();
