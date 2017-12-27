'use strict';

import Backbone from 'backbone';
import _ from 'underscore';
import moment from 'moment';

class LayersCollection extends Backbone.Collection {

  url() {
    return `${config.apiUrl}/layers`;
  }

  /* Within the category "mode", set the layer "slug" as active and all the
   * other inactive */
  setActiveLayer(mode, slug) {
    let specs = this.toJSON();
    specs.filter(layer => layer.category === mode)
      .forEach(layer => {
        const isActive = layer.slug === slug;
        layer.active = isActive;

        if(isActive && ENVIRONMENT === 'production') {
          /* Google Analytics */
          ga('send', 'event', 'Map', 'Toggle', layer.name);
        }
      });
    this.set(specs);
    this.trigger('change');
  }

  /* Return the active layer for the current mode, if exists */
  getActiveLayer(mode) {
    return this.findWhere({
      active: true,
      category: mode
    });
  }

  /* Return a range formed by the minimum date contained into the domain
   * property of the layers and the maximum one */
  getDataDomain() {
    return this.toJSON()
      .map(layer => layer.domain.map(date => moment.utc(date, 'YYYY-MM-DD').toDate()))
      .reduce((res, domain) => {
        if(+res[0] > +domain[0]) res[0] = domain[0];
        if(+res[1] < +domain[1]) res[1] = domain[1];
        return res;
      }, [Infinity, -Infinity]);
  }

}

export default new LayersCollection();
