'use strict';

import './styles.postcss';
import React from 'react';

import DashTabs from './DashTabs';
import DashSummary from './DashSummary';
import DashMapMode from './DashMapMode';

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
          <div className="dashboard-header">
            <button className="text text-link">filters</button>
            <a href="http://www.care.org/donate" rel="noreferrer" target="_blank"className="btn btn-secondary">
              Donate
            </a>
          </div>
          <div className="scroll-wrapper">
            <DashSummary
              currentMap = { this.props.currentMap }
            />
            <DashMapMode
              currentMap = { this.props.currentMap }
            />
          </div>
        </div>
      </div>
    );
  }

}

export default Dashboard;
