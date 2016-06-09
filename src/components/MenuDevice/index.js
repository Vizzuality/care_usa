'use strict';

import './styles.postcss';
import React from 'react';

class MenuDevice extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={ this.props.deviceMenuOpen ?  "is-visible m-menu--device"  : "m-menu--device" }
           ref="menuDevice">
        <div className={ this.props.deviceMenuOpen ?  "is-visible background-viel"  : "background-viel" } onClick={ this.props.toggleMenuFn }></div>
        <div className="menu-content">
          <button className="btn-close-menu" onClick={ this.props.toggleMenuFn } >
            <svg className="icon icon-close">
              <use xlinkHref="#icon-close"></use>
            </svg>
          </button>
          <div className="wrap">
            <ul className="menu">
              <li className={ this.props.currentPage == "who-cares" && 'is-active' } ><a href="/" className='menu-link text text-module-title -dark'>Donor Impact Map</a></li>
              <li className={ this.props.currentPage == "anniversary" && 'is-active' } ><a href="anniversary.html" className='menu-link text text-module-title -dark'>CARE’s History</a></li>
            </ul>
          </div>
          <div className="care-page-link text text-legend-s -dark wrap">
            <p>Visit us at </p><a href="http://www.care.org"  target="_blank" className="text -primary">www.care.org</a>
          </div>
        </div>
      </div>
    )
  }
}

export default MenuDevice;
