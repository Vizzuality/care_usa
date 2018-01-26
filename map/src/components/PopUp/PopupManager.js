'use strict';

import Backbone from 'backbone';
import AbstractPopup from './popups/AbstractPopup';
import RefugeesPopup from './popups/RefugeesPopup';
import DonationPopup from './popups/DonationPopup';
import AmountDonatedPopup from './popups/AmoutDonatedPopup';
import PeopleReachedPopup from './popups/PeopleReachedPopup';
import StoriesPopup from './popups/StoriesPopup';
import './styles.postcss';

export default class PopupManager extends Backbone.View {

  constructor(map, lat, lng, zoom, date, slug, options) {
    super();

    switch(slug) {

      case 'stories':
        return new StoriesPopup(map, lat, lng, zoom, date, options);

      case 'refugee-assistance':
        return new RefugeesPopup(map, lat, lng, zoom, date, options);

      case 'number-of-donors':
        return new DonationPopup(map, lat, lng, zoom, date, options);

      case 'amount-of-money':
        return new AmountDonatedPopup(map, lat, lng, zoom, date, options);

      case 'people-reached':
        return new PeopleReachedPopup(map, lat, lng, zoom, date, options);

    }
  }

}
