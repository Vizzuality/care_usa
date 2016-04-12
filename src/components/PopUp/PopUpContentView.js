'use strict';

import Backbone from 'backbone';
import _ from 'underscore';

import PopUpDonation from './PopUpDonation';
import PopUpProject from './PopUpProject';

class PopUpContentView extends Backbone.View {

  initialize(options) {
    this.options = options;
  }

  getPopUp() {
    if (this.options.currentMap == 'donations') {
      new PopUpDonation(this.options);
    } else {
      new PopUpProject(this.options);
    }
  }


}

export default PopUpContentView;