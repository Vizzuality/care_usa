'use strict';

import Backbone from 'backbone';
import AbstractPopup from './popups/AbstractPopup';
import RefugeesPopup from './popups/RefugeesPopup';
import DonationPopup from './popups/DonationPopup';
import AmountDonatedPopup from './popups/AmoutDonatedPopup';
import './styles.postcss';

export default class PopupManager extends Backbone.View {

  constructor(map, lat, lng, zoom, date, slug) {
    super();

    switch(slug) {

      case 'refugee-assistance':
        return new RefugeesPopup(map, lat, lng, zoom, date);

      case 'number-of-donors':
        return new DonationPopup(map, lat, lng, zoom, date);

      case 'amount-of-money':
        return new AmountDonatedPopup(map, lat, lng, zoom, date);

    }

    return new AbstractPopup(map, lat, lng, zoom, date);
    // people-reached
    // 461refugee-assistance
  }

}
