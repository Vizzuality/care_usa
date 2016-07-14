'use strict';

import Backbone from 'backbone';
import utils from '../../scripts/helpers/utils';
import MyDonationModel from '../../scripts/models/MyDonationModel';
import MyDonationPopup from '../PopUp/popups/MyDonationPopup';

export default class DonationMarker extends Backbone.View {

  constructor(donationId, layerSlug, map) {
    super();

    this.map = map;

    this.model = new MyDonationModel(donationId);
    this.model.fetch()
      .done(data => {
        const isMobile = utils.checkDevice().mobile;

        this.createMarker();
        this.updateVisibility(layerSlug);

        if(layerSlug !== 'amount-of-money') return;
        map.setView([ data.lat - (isMobile ? 30 : 0), data.lng ]);
        if(!isMobile) this.openPopup();

        console.log(data);
      })
      .fail(err => {
        throw new Error(`Unable to fetch the detail of the donation: ${err}`);
      });
  }

  /**
   * Create the marker
   */
  createMarker() {
    const isMobile = utils.checkDevice().mobile;
    const data = this.model.toJSON();

    this.marker = L.marker([ data.lat, data.lng ], {
        icon: L.divIcon({
          className: 'icon-my-donation animation',
          iconSize: null
        })
      });

    this.marker.on('click', () => this.openPopup());
  }

  /**
   * Update the visibility of the marker depending on the layer: or remove it
   * from the map or add it. Additionally, close the popup when the marker is
   * removed.
   * @param  {String} layerSlug slug of the current layer
   */
  updateVisibility(layerSlug) {
    if(layerSlug !== 'amount-of-money') {
      if(this.map.hasLayer(this.marker)) this.map.removeLayer(this.marker);
      this.closePopup();
    } else {
      if(!this.map.hasLayer(this.marker)) this.marker.addTo(this.map);
    }
  }

  /**
   * Open the popup
   */
  openPopup() {
    const data = this.model.toJSON();

    this.closePopup();
    this.popup = new MyDonationPopup(this.map, data.lat, data.lng, null, null, data);

    /* We remove the animation from the marker the first time the popup is
     * opened */
    this.marker._icon.classList.remove('animation');
  }

  /**
   * Close the popup
   */
  closePopup() {
    if(this.popup) this.popup.close();
  }

}
