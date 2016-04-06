'use strict';

import './styles.postcss';
import React from 'react';
import ReactDOM from 'react-dom';

class MenuDevice extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={ this.props.deviceMenuOpen ?  "is-visible m-menu--device"  : "m-menu--device" }
           ref="menuDevice">
        <button
          className="btn-close"
          onClick={ this.props.toggleMenuFn }
        />
        <ul className="menu">
          <li><a href="/about" className="menu-link">who cares</a></li>
          <li><a href="/aniversary" className="menu-link">CARE’s Anniversary</a></li>
        </ul>
      </div>
    )
  }

};

export default MenuDevice;
