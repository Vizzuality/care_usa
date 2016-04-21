'use strict';

import Backbone from 'backbone';

class LayersCollection extends Backbone.Collection {

  initialize() {

  };
}

LayersCollection.prototype.url = '/layersSpec.json';

export default new LayersCollection();
