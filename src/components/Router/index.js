'use strict';

import Backbone from 'backbone';
import ParamsModel from './ParamsModel';
import URI from 'urijs';

class Router extends Backbone.Router {

  initialize() {
    this.params = new ParamsModel();
  }

  update(params) {
    this.params.set(params, { trigger: false });
    const routeString = this.serializeParams(this.params.attributes);
    this.navigate(`${this.currentRoute || ''}${routeString}`);
  }

  /**
   * Parse URL params using URI.js API
   * @param  {String} queryString https://medialize.github.io/URI.js/docs.html
   * @return {Object}
   */
  parseParams(queryString) {
    // TODO: detect pushState
    return URI.parseQuery(`?${queryString}`);
  }

  /**
   * Serialze URL params using URI.js API
   * @param  {Object} params https://medialize.github.io/URI.js/docs.html
   * @return {String}
   */
  serializeParams(params) {
    const queryString = URI.buildQuery(params);
    return `?${queryString}`;
  }

  /**
   * Use it to start history HTML5 API
   */
  start(options) {
    let opts = options;
    if (!options) {
      opts = { pushState: false };
    }
    if (!Backbone.History.started) {
      Backbone.history.start(options);
    }
  }

}

export default Router;
