'use strict';

import Backbone from 'backbone';

class DashSummaryModel extends Backbone.Model {


  url() {
    return `${config.apiUrl}/statistics`
  }
}

export default DashSummaryModel;
