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
    /* Defensive programming: there's no else instruction in the getPopup method
     * so we could eventually trigger an error here */
    if(!this.currentPopUp) return;

    this.currentPopUp.closePopUp()
  }

  getPopUp() {
    if (this.options.currentLayer === 'my-donation'){
      this.currentPopUp = new PopUpMyDonation(this.options);
    } else if (this.options.layer.slug === 'amount-of-money' || this.options.layer.slug === 'amount-of-money-torque') {
      this.currentPopUp = new PopUpDonation(this.options);
    } else if (this.options.layer.slug === 'number-of-donors') {
      this.currentPopUp = new PopUpDonationDist(this.options);
    } else if (this.options.layer.slug === 'refugee-assistance') {
      this.currentPopUp = new PopUpRefugees(this.options);
    } else if (this.options.layer.slug === 'projects') {
      this.currentPopUp = new PopUpProject(this.options);
    }
  }


}

export default PopUpContentView;
