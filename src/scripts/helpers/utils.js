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

/* Return true if the two passed ranges intersect, optionally a compare method
 * can be passed */
function rangesIntersect(range1, range2, compareFunc) {
  const compare = compareFunc || ((a, b) => a - b);
  const minRange = compare(range1[0], range2[0]) < 0 ? range1 : range2;
  const maxRange = minRange === range1 ? range2 : range1;
  return compare(minRange[1], maxRange[0]) > 0;
}

export default {
  checkDevice,
  matches,
  pad,
  rangesIntersect
};


// Handlebars.registerHelper('compare', function(lvalue, operator, rvalue,
//   options) {
//   if(arguments.length < 4) {
//     throw new Error('Handlerbars Helper "compare" needs 3 parameters');
//   }

//   var operators = {
//     '==':     function (l, r) { return l        ==  r; },
//     '===':    function (l, r) { return l        === r; },
//     '!=':     function (l, r) { return l        !=  r; },
//     '!==':    function (l, r) { return l        !== r; },
//     '<':      function (l, r) { return l        <   r; },
//     '>':      function (l, r) { return l        >   r; },
//     '<=':     function (l, r) { return l        <=  r; },
//     '>=':     function (l, r) { return l        >=  r; },
//     'typeof': function (l, r) { return typeof l ==  r; }
//   };

//   if (!operators[operator]) {
//     throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' +
//       operator);
//   }

//   var res = operators[operator](lvalue, rvalue);

//   if (res) {
//       return options.fn(this);
//   }

//   return options.inverse(this);
// });
