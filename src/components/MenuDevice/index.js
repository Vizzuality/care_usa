'use strict';

import './styles.postcss';
import React from 'react';
import ReactDOM from 'react-dom';

class MenuDevice extends React.Component {

  constructor(props) {
    super(props);
  }

  _closeSubmenu() {
    this.refs.menuDevice.classList.remove('is-visible');
  }

  componentWillMount() {
    console.log(this.props.onClick);
  }

  render() {
    return (
      <div className={ this.props.deviceMenuOpen ?  "is-visible m-menu--device"  : "m-menu--device" } 
           ref="menuDevice">
        <button 
          className="btn-close js-close-menu"
          onClick={ this.props.onClick }
        />
        <ul className="menu">
          <li className="menu-link"><a href="/about">who cares</a></li>
          <li className="menu-link"><a href="/aniversary">CARE’s Anniversary</a></li>
         </ul>
      </div>
    )
  }
  
};

export default MenuDevice;
