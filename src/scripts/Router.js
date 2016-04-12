'use strict';

import Backbone from 'backbone';

class ParamsModel extends Backbone.Model {

}

class Router extends Backbone.Router {

  constructor() {
    super();
  }

  initialize() {
    this.params = new ParamsModel();
    this._setParams();
  }

  welcome() {

  }

  _setParams() {
    
  }

}

Router.prototype.routes = {
  'map(/zoom:zoom)(/lat:lat)(/long:long)': 'welcome'
};

export default Router;
