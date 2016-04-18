'use strict';

import Backbone from 'backbone';

class LayersCollection extends Backbone.Collection {

  initialize() {
    console.log('hi!')
  }

  parse(data) {
    return data;
  }
}

LayersCollection.prototype.url = './public/layersSpec.json';

export default LayersCollection;
