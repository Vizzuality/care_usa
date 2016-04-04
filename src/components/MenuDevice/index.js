'use strict';

import './styles.postcss';
import React from 'react';
import ReactDOM from 'react-dom';

class MenuDevice extends React.Component {

  render() {
    return (
      <div className="m-menu--mobile">
        <ul className="menu">
          <li className="menu-link"><a href="/about">who cares</a></li>
          <li className="menu-link"><a href="/aniversary">CARE’s Anniversary</a></li>
         </ul>
      </div>
    )
  }
  
};

export default MenuDevice;
