'use strict';

import Backbone from 'backbone';

class LayersCollection extends Backbone.Collection {

  initialize() {
      
  };
}

LayersCollection.prototype.url = './public/layersSpec.json';

export default new LayersCollection();
