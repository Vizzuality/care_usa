'use strict';

import './dash-tabs-styles.postcss';
import React from 'react';

import DashTabs from './DashTabs';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="l-dashboard">
        <DashTabs
          currentMap = { this.props.currentMap }
          changeMapFn = { this.props.changeMapFn }
        />
        <div className="l-dash-filters"></div>
      </div>
    );
  }

}

export default Dashboard;
