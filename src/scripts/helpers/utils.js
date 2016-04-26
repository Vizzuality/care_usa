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

function pad(number, times, char) {
	let str = number + '';
	while(str.length < times) str = char + str;
	return str;
}

function numberNotation(number) {
  if (!isNaN(parseFloat(number))) {

    if (number % 1 != 0) {

      if (parseInt(number).toString().length > 3) {
        return parseFloat(number).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      } else {
        return parseFloat(number).toFixed(2);
      }

    } else {

      if (parseInt(number).toString().length > 3) {
        var d = parseFloat(number).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        return d.split('.')[0];
      }
    }
  }

  return number;
}

export default {
  checkDevice,
  matches,
  pad,
  numberNotation
};



