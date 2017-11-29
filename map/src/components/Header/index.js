'use strict';

import React from 'react';
import './styles.postcss';

class Header extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.page = window.location.pathname;
  }

  render() {
    return (
      <div id="header" className="l-header">
        <div className="wrap">
          <a className="logo">
            <img className="icon icon-logo" src={ require('../../images/care-logo.png') } />
          </a>
          { !this.props.embed ?
            <div className="m-main-menu">
              <button
                className="btn-menu-toggle"
                onClick={ this.props.toggleMenuFn }
              >
                <svg className="icon icon-menu">
                  <use xlinkHref="#icon-menu" />
                </svg>
              </button>
            </div> :
            <a href="#" className="btn btn-primary btn-embed -mobileHidden">Explore the map</a>
          }
        </div>
        <nav className="nav-bar">
          <ul className="nav-item-list">
            <li className="nav-item text text-nav -active">
              <a href="/map">Map of Impact</a>
            </li>
            <li className="nav-item text text-nav">
              <a href="/stories">Stories</a>
            </li>
            <li className="nav-item text text-nav">
              <a href="/about">About</a>
            </li>
            <li className="nav-item text text-nav">
              <a href="/donate">Donate</a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Header;
