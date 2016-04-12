'use strict';

import './styles.postcss';
import React from 'react';

import DashTabs from './DashTabs';
import DashSummary from './DashSummary';
import DashMapMode from './DashMapMode';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mapMode: "moneyAmount",
      dashboardOpen: true
    };
  }

  changeMapModeFn(mapCurrentMode, e) {
    this.setState({ mapMode: mapCurrentMode })
  }

  toogleDashboard() {
    this.setState({ dashboardOpen: !(!!this.state.dashboardOpen) })
  }

  render() {
    return (
      <div className={ this.state.dashboardOpen ? "l-dashboard is-open" : "l-dashboard" }>
        <button className="btn-dashboard-switcher"
          onClick={ this.toogleDashboard.bind(this) }
        >
          <svg className="icon icon-arrowleft"><use xlinkHref="#icon-arrowleft"></use></svg>
        </button>
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
              mapMode = "moneyAmount"
              mapModeLiteral = "Amount of money"
              changeMapModeFn = { this.changeMapModeFn.bind(this) }
              checked = { this.state.mapMode == "moneyAmount" && true }
            />
            <DashMapMode
              currentMap = { this.props.currentMap }
              mapMode = "donorsNumber"
              mapModeLiteral = "Number of donors"
              changeMapModeFn = { this.changeMapModeFn.bind(this) }
              checked = { this.state.mapMode == "donorsNumber" && true }
            />
          </div>
        </div>
      </div>
    );  
  }

}

export default Dashboard;
