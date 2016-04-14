'use strict';

import $ from 'jquery';


function checkDevice() {
  const mobileWidth = 640;
  const tableWidth = 767;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const width = $(document).width();
  const isMobile = width <= mobileWidth;
  const isTablet = (!isMobile && width <= tableWidth);
  const isDevice = mobileRegex.test(navigator.userAgent);
  return {
    mobile: isMobile,
    tablet: isTablet,
    device: isDevice
  };
}

/* Polyfill for the matches DOM API method (IE 9+)
 * Source: http://youmightnotneedjquery.com */
function matches(el, selector) {
  return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
}

export default {
  checkDevice,
  matches
};
