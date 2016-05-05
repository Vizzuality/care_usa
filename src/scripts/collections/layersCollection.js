'use strict';

import Backbone from 'backbone';

class LayersCollection extends Backbone.Collection {

  url() {
    return `${config.apiUrl}/layers`;
  }

  parse(data) {
    return data.map(layerSpec => {
      switch(layerSpec.slug) {
        case 'amount-of-money':
          layerSpec.timeline = {
            speed: 10,
            interval: {
              unit: 'week',
              count: 2
            }
          };
          break;
        case 'number-of-donors':
          layerSpec.timeline = {
            speed: 40,
            interval: {
              unit: 'month',
              count: 1
            }
          };
          break;
        case 'projects':
          layerSpec.timeline = {
            speed: 40,
            interval: {
              unit: 'year',
              count: 1
            }
          };
          break;
        case 'refugee-assistance':
          layerSpec.timeline = {
            speed: 40,
            interval: {
              unit: 'year',
              count: 1
            }
          };
          break;
      }

      layerSpec.domain = [
        layerSpec.start_date,
        layerSpec.end_date
      ];
      delete layerSpec.start_date;
      delete layerSpec.end_date;

      return layerSpec;
    });
  }

}

export default new LayersCollection();
