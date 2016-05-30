'use strict';

import Backbone from 'backbone';
import $ from 'jquery';

class DonationModel extends Backbone.Model {

  getDonationInfo(id){
    const url = `${config.apiUrl}/donations/${id}`;
    return this.fetch({url: url})
  }

  parse(data) {
    return data;
  }

};


export default new DonationModel();
