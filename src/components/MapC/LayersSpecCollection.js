'use strict';

import _ from 'underscore';
import Backbone from 'backbone';
import LayerSpecModel from './LayerSpecModel';
import CartoDBLayer from './Layers/CartoDBLayer';
import MarkerLayer from './Layers/MarkerLayer';

class LayersSpecCollection extends Backbone.Collection {

  instanceLayers() {
    _.each(this.models, (model) => {
      if (model.attributes.type === 'cartodb') {
        model.layerInstance = new CartoDBLayer(model.attributes);
      }
      if (model.attributes.type === 'marker') {
        model.layerInstance = new MarkerLayer(model.attributes);
      }
    });
  }

}

LayersSpecCollection.prototype.model = LayerSpecModel;

export default LayersSpecCollection;
