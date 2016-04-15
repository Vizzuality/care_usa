'use strict';

import './styles.postcss';
import React from 'react';

class MenuDevice extends React.Component {

  constructor(props) {
    super(props);
    console.log(this.props)
  }

  render() {
    return (
      <div className={ this.props.deviceMenuOpen ?  "is-visible m-menu--device"  : "m-menu--device" }
           ref="menuDevice">
        <button className="btn-close-menu" onClick={ this.props.toggleMenuFn } >
          <svg className="icon icon-close">
            <use xlinkHref="#icon-close"></use>
          </svg>
        </button>
        <div className="wrap">
          <ul className="menu">
            <li className={ this.props.currentPage == "who-cares" && 'is-active' } ><a href="/" className='menu-link text text-module-title -dark'>Who cares</a></li>
            <li className={ this.props.currentPage == "anniversary" && 'is-active' } ><a href="anniversary.html" className='menu-link text text-module-title -dark'>CARE’s Anniversary</a></li>
          </ul>
        </div>
      </div>
    )
  }
}

export default MenuDevice;
