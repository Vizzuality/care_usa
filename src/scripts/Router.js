'use strict';

import Backbone from 'backbone';

class ParamsModel extends Backbone.Model {}

class Router extends Backbone.Router {

  initialize() {
    this.params = new ParamsModel();
  }

  toWelcome() {
    this.navigate('welcome', { trigger: true });
  }

  welcome() {
    // console.log(this.params.attributes);
  }

  application() {
    // console.log(this.params.attributes);
  }

  _setParams(routeName, params) {
    const result = {};
    if (routeName === 'application') {
      if (params[0]) {
        result.zoom = params[0] && Number(params[0]);
      }
      if (params[1]) {
        result.lat = params[1] && Number(params[1]);
      }
      if (params[2]) {
        result.lon = params[2] && Number(params[2]);
      }
      this.params.set(result);
    }
  }

  /**
   * This function will be executed before route change
   */
  execute(callback, params, routeName) {
    this._setParams(routeName, params);
    if (callback) {
      callback.apply(this, params);
    }
  }

}

Router.prototype.routes = {
  '(/)': 'toWelcome',
  'welcome': 'welcome',
  'map(/zoom::zoom)(/lat::lat)(/lon::lon)': 'application'
};

export default Router;
