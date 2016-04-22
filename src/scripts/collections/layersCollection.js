'use strict';

import Backbone from 'backbone';
import config from './../../config';

class LayersCollection extends Backbone.Collection {}

LayersCollection.prototype.url = config.apiUrl + '/layers';

export default new LayersCollection();
