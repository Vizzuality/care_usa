'use strict';

import Backbone from 'backbone';

class LayersCollection extends Backbone.Collection {

  initialize() {
      
  };

  parse(data) {
    return data;
  }
}

LayersCollection.prototype.url = './public/layersSpec.json';

export default LayersCollection;
