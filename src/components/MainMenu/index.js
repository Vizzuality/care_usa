'use strict';

import './styles.postcss';
import React from 'react';
import ReactDOM from 'react-dom';

class MainMenu extends React.Component {

  constructor(props) {
    super(props);
  }

  _toogleSubmenu() {
    console.log('yup');
  }
  
  render() {
    return (
      <div className="m-main-menu" id="mainMenu">
        <button 
          className="btn-menu-toggle"
          onClick={ this._toogleSubmenu }
      />
       <ul className="menu">
         <li className="menu-link"><a href="/about">who cares</a></li>
         <li className="menu-link"><a href="/aniversary">CARE’s Anniversary</a></li>
       </ul>
     </div>
    );
  }

};

export default MainMenu;
