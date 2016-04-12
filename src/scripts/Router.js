'use strict';

import Backbone from 'backbone';

class ParamsModel extends Backbone.Model {}

class Router extends Backbone.Router {

  constructor() {
    super();
  }

  initialize() {
    this.params = new ParamsModel();
  }

  toWelcome() {
    this.navigate('welcome', { trigger: true });
  }

  welcome() {
    console.log(this.params.attributes);
  }

  application() {
    console.log(this.params.attributes);
  }

  _setParams(routeName, params) {
    if (routeName === 'application') {
      this.params.set({
        zoom: params[0] && Number(params[0]),
        lat: params[1] && Number(params[1]),
        lon: params[2] && Number(params[2])
      });
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
