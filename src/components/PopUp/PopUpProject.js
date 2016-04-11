'use strict'

import './styles.postcss';
import Backbone from 'backbone';
import DonorModel from './../../scripts/models/DonorModel';

class PopUpProject extends Backbone.View {

  initialize(options) {
   this.options = options;

    this.model = new DonorModel( {lat: this.options.latLng.lat, lng: this.options.latLng.lng });

    this.model.fetch().done(() => {
      if (this.model.get('city')) {
        this.options.data = this.model;
        this._drawPopUp();
      }

    });
  }

  _drawPopUp() {
    L.popup()
      .setLatLng(this.options.latLng)
      .setContent(this.getContent())
      .openOn(this.options.map);
  }

  getContent() {
    return `<div class="pop-up-content">
              <p>Donations</p>
              <h2>${ this.model.get('city') }</h2>
            </div>`
  }

}

export default PopUpProject;
