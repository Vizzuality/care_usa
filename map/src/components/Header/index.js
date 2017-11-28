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

  setLogoClick() {
    return this.page.indexOf('anniversary.html') === -1 ? 
      <a className="logo">
        <img className="icon icon-logo" src={ require('../../images/logoCARE.svg') }></img>
      </a> :
      <a href="/" className="logo">
        <img className="icon icon-logo" src={ require('../../images/logoCARE.svg') }></img>
      </a>;
  }

  render() {
    return (
      <div id="header" className="l-header">
        <div className="wrap">
          { this.setLogoClick() }

          { !this.props.embed ?
            <div className="m-main-menu">
              <button
                className="btn-menu-toggle"
                onClick={ this.props.toggleMenuFn }
              >
                <svg className="icon icon-menu">
                  <use xlinkHref="#icon-menu"></use>
                </svg>
              </button>
            </div> :
            <a href="#" className="btn btn-primary btn-embed -mobileHidden">Explore the map</a>
          }
        </div>
      </div>
    );
  }
}

export default Header;
