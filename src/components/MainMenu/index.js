'use strict';

import './styles.postcss';
import React from 'react';
import ReactDOM from 'react-dom';


class MainMenu extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="m-main-menu" id="mainMenu">
        <button 
          className="btn-menu-toggle"
          onClick={ this.props.onClick }
          />
        <ul className="menu">
          <li><a href="/about" className="menu-link">who cares</a></li>
          <li><a href="/aniversary" className="menu-link">CARE’s Anniversary</a></li>
      </ul>
     </div>
    );
  }

};

export default MainMenu;
