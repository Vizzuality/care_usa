'use strict';

import './styles.postcss';
import React from 'react';

class MainMenu extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="m-main-menu">
        <button
          className="btn-menu-toggle"
          onClick={ this.props.toggleMenuFn }
        />
        <ul className="menu">
          <li><a href="#" className={ this.props.currentTab == 'who-cares' ? 'is-active menu-link' : 'menu-link' } onClick={ this.props.changePageFn.bind(null, 'who-cares') }>Who cares</a></li>
          <li><a href="#" className={ this.props.currentTab == 'anniversary' ? 'is-active menu-link' : 'menu-link' } onClick={ this.props.changePageFn.bind(null, 'anniversary') }>CARE’s Anniversary</a></li>
      </ul>
     </div>
    );
  }

}

export default MainMenu;
