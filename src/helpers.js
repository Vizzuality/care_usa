'use strict';

import $ from 'jquery';

function checkDevice() {
  if ( $(document).width() <= 640) {
    return({ mobile: true, tablet: false, device: true});
  } else if ($(document).width() <= 768) {
    return({ mobile: false, tablet: true, device: true});
  } else {
    return({ mobile: false, tablet: false, device: false});
  }
}

export default {
  checkDevice: checkDevice
};
