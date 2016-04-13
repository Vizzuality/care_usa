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
    console.log(this.params);
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
      if (params[3]) {
        result.currentMap = params[3] && String(params[3]);
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
  'map(/zoom::zoom)(/lat::lat)(/lon::lon)(/layer::layer)': 'application'
};

export default Router;
