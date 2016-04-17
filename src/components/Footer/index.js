'use strict';

import './styles.postcss';
import React from 'react';

class Footer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="footer" className="l-footer">
       <div className="wrap">
        <a href="/" className="logo">
          <img className="icon icon-logo" src={ require('../../images/logo.svg') }></img>
        </a>
          <div className="third-party-webs">
            <p className="text text-legend-s">Follow us</p>
            <svg className="icon icon-facebook -primary"><use xlinkHref="#icon-facebook"></use></svg>
            <svg className="icon icon-twitter -primary"><use xlinkHref="#icon-twitter"></use></svg>
            <svg className="icon icon-instagram -primary"><use xlinkHref="#icon-instagram"></use></svg>
            <svg className="icon icon-youtube -primary"><use xlinkHref="#icon-youtube"></use></svg>
            <svg className="icon icon-googleplus -primary"><use xlinkHref="#icon-googleplus"></use></svg>
          </div>
          <div className="own-web text text-highlighted">Also visit our page <a href="www.care.org" className="text -primary">www.care.org</a></div>
       </div>
      </div>
    );
  }
}

export default Footer;
