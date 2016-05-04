'use strict';

import React from 'react';
import Router from '../Router';
import MainMenu from '../MainMenu';

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      embed: false
    };
  }

  isEmbed() {
    const params = window.location.hash.split('&');
    params.map(param => {
      if (param.indexOf('embed=') !== -1) this.state.embed = param.split('=')[1];
    });
  }

  render() {
    this.isEmbed();
    return (
      <div id="header" className="l-header">
        <div className="wrap">
          <a href="/" className="logo">
            <img className="icon icon-logo" src={ require('../../images/logoCARE.svg') }></img>
          </a>
          { !this.state.embed ? 
            <div className="m-main-menu">
              <button
                className="btn-menu-toggle"
                onClick={ this.props.toggleMenuFn }
              >
                <svg className="icon icon-menu">
                  <use xlinkHref="#icon-menu"></use>
                </svg>
              </button>
              <ul className="menu">
                <li><a href="/" className={ this.props.currentTab == 'who-cares' ? 'is-active menu-link' : 'menu-link' } onClick={ this.props.changePageFn.bind(null, 'who-cares') }>Donor Impact Map</a></li>
                <li><a href="anniversary.html" className={ this.props.currentTab == 'anniversary' ? 'is-active menu-link' : 'menu-link' } onClick={ this.props.changePageFn.bind(null, 'anniversary') }>CARE’s History</a></li>
              </ul>
            </div> : '' }
          
        </div>
      </div>
    );
  }
}

export default Header;
