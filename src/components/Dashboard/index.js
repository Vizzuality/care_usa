'use strict';

import './styles.postcss';
import React from 'react';

import DashTabs from './DashTabs';
import DashSummary from './DashSummary';

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
        <div className="m-dashboard-panel">
          <div className="scroll-wrapper">
            <DashSummary
              currentMap = { this.props.currentMap }
            />
          </div>
        </div>
      </div>
    );
  }

}

export default Dashboard;
