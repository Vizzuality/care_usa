'use strict';

import Backbone from 'backbone';

class GeoModel extends Backbone.Model {

  url() {
    return `https://places.nlp.nokia.com/places/v1/discover/search/?app_id=${config.nokiaAppId}&app_code=${config.nokiaAppCode}&Accept-Language=en-US&at=0,0`;
  }

  parse(data) {
    return data.results.items[0];
  }

}

export default GeoModel;
