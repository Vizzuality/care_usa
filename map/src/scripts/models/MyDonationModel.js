'use strict';

import Backbone from 'backbone';

export default class MyDonationModel extends Backbone.Model {

  constructor(donationId) {
    super();
    this.donationId = donationId;
  }

  url() {
    return `${config.apiUrl}/donations/${this.donationId}`;
  }

};
