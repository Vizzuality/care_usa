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
        <div className="menu-close">
          <button
            onClick={ this.props.toggleMenuFn }
          >
            <svg className="icon icon-close">
              <use xlinkHref="#icon-close"></use>
            </svg>
          </button>
        </div>
        
        <ul className="menu">
          <li><a href="/" className="menu-link text text-module-title -dark">Who cares</a></li>
          <li><a href="anniversary.html" className="menu-link text text-module-title -dark">CARE’s Anniversary</a></li>
        </ul>
      </div>
    )
  }
}

export default MenuDevice;
