'use strict';

import config from './../../config';
import $ from 'jquery';

const defaults = {
  cartodbAccount: config.cartodbAccount
};

class CreateTileLayer {

  /*
   * Options: {
   *  account,
   *  sql,
   *  cartoCss
   * }
   */
  constructor(options) {
    this.options = Object.assign(defaults, options);
  }

  createLayer() {

    const cartoAccount = this.options.cartodbAccount;

    // data layers parameterization
    const request = {
      layers: [{
        'user_name': cartoAccount,
        'type': 'cartodb',
        'options': {
          'sql': this.options.sql,
          'cartocss': this.options.cartoCss,
          'cartocss_version': '2.3.0'
        }
      }]
    };

    const promise = new Promise( (resolve) => {

      $.ajax({
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        url: 'http://'+ cartoAccount +'.cartodb.com/api/v1/map/',
        data: JSON.stringify(request),
        success: (data) => {

          const tileUrl = 'https://' + cartoAccount + '.cartodb.com/api/v1/map/' + data.layergroupid + '/{z}/{x}/{y}.png32';
          this.layer = L.tileLayer(tileUrl);

          resolve(this.layer);
        }
      });
    });

    return promise;
  }

  addLayer(map) {
    this.layer.addTo(map);
  }

}

export default CreateTileLayer;
