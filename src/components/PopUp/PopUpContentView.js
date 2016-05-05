'use strict';

import Backbone from 'backbone';
import _ from 'underscore';

import PopUpDonation from './PopUpDonation';
import PopUpMyDonation from './PopUpMyDonation';
import PopUpDonationDist from './PopUpDonationDist';
import PopUpProject from './PopUpProject';
import PopUpRefugees from './PopUpRefugees';

class PopUpContentView extends Backbone.View {

  initialize(options) {
    this.options = options;
  }

  closeCurrentPopup(){
    this.currentPopUp.closePopUp()
  }

  getPopUp() {
    console.log(this.options)
    if (this.options.currentLayer === 'amount-of-money' || this.options.currentLayer === 'amount-of-money-torque') {
      this.currentPopUp = new PopUpDonation(this.options);
    } else if (this.options.currentLayer === 'number-of-donors') {
      this.currentPopUp = new PopUpDonationDist(this.options);
    } else if (this.options.currentLayer === 'my-donation'){
      this.currentPopUp = new PopUpMyDonation(this.options);
    } else if (this.options.currentLayer === 'refugee-assistance') {
      this.currentPopUp = new PopUpRefugees(this.options);
    } else {
      this.currentPopUp = new PopUpProject(this.options);
    }
  }


}

export default PopUpContentView;
