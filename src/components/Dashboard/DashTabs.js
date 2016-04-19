'use strict';

import './dash-tabs-styles.postcss';
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
              className={ this.props.currentMode == 'donations' && 'is-active' }
              onClick={ this.props.changeModeFn.bind(null, 'donations') }
            ><span>Donations</span></button></li>
          <li className='tab'>
            <button
              className={ this.props.currentMode == 'projects' && 'is-active' }
              onClick={ this.props.changeModeFn.bind(null, 'projects') }
            ><span>Projects</span></button></li>
        </ul>
     </div>
    );
  }

}

export default DashboardTabs;
