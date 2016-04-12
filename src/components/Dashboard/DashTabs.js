'use strict';

import './styles.postcss';
import React from 'react';

class DashboardTabs extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }

  render() {
    return (
      <div className="l-dash-tabs">
        <ul className="m-dashboard-tabs">
          <li className='tab'>
            <button
              className={ this.props.currentMap == 'donations' && 'is-active' }
              onClick={ this.props.changeMapFn.bind(null, 'donations') }
            >Donations</button></li>
          <li className='tab'>
            <button
              className={ this.props.currentMap == 'projects' && 'is-active' }
              onClick={ this.props.changeMapFn.bind(null, 'projects') }
            >Projects</button></li>
        </ul>
     </div>
    );
  }

}

export default DashboardTabs;