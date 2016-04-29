'use strict';

import Backbone from 'backbone';

class DonorsModalModel extends Backbone.Model {

}

DonorsModalModel.prototype.defaults = {
  'donorsOpen': false
};

export default new DonorsModalModel();
