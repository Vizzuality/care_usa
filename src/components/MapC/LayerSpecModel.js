'use strict';

import Backbone from 'backbone';
import CartoDBLayer from './Layers/CartoDBLayer';
import MarkerLayer from './Layers/MarkerLayer';

class LayerSpecModel extends Backbone.Model {

  instanceLayer(data) {
    if (this.attributes.type === 'cartodb') {
      this.instanceLayer = new CartoDBLayer(this.attributes);
    }
    if (this.attributes.type === 'marker') {
      this.instanceLayer = new MarkerLayer(this.attributes);
    }
  }

}

// LayerSpecModel.prototype.defaults = {
//   name: '', // String
//   account: '', // String
//   type: 'cartodb', // String
//   sql: null, // String
//   cartocss: null, // String
//   active: true // Boolean
// };

export default LayerSpecModel;
