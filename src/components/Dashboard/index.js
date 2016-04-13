'use strict';

import './styles.postcss';
import React from 'react';

import DashTabs from './DashTabs';
import DashSummary from './DashSummary';
import DashMapMode from './DashMapMode';

import utils from '../../scripts/helpers/utils';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mapMode: "moneyAmount",
      dashboardOpen: true
    };
  }

  componentWillMount() {
    this.setState(utils.checkDevice());
  }

  changeMapModeFn(mapCurrentMode, e) {
    this.setState({ mapMode: mapCurrentMode })
  }

  toogleDashboard() {
    this.setState({ dashboardOpen: !(!!this.state.dashboardOpen) })
  }

  render() {
    let tabsMobile;
    let tabsDesktop;

    if ( this.state.mobile ) {
      tabsMobile =  <DashTabs
                      currentLayer = { this.props.currentLayer }
                      changeMapFn = { this.props.changeMapFn }
                    />
      tabsDesktop = null;
    } else {
      tabsDesktop = <DashTabs
                      currentLayer = { this.props.currentLayer }
                      changeMapFn = { this.props.changeMapFn }
                    />
      tabsMobile = null;
    }

    return (
      <div>
        { tabsMobile }
        <div className={ this.state.dashboardOpen ? "l-dashboard is-open" : "l-dashboard" }>
          <button className="btn-dashboard-switcher"
            onClick={ this.toogleDashboard.bind(this) }
          >
            <svg className="icon icon-arrowleft"><use xlinkHref="#icon-arrowleft"></use></svg>
          </button>

          { tabsDesktop }

          <div className="m-dashboard-panel">
            <div className="dashboard-header">
              <button className="text text-link">filters</button>
              <a href="http://www.care.org/donate" rel="noreferrer" target="_blank"className="btn btn-secondary">
                Donate
              </a>
            </div>
            <div className="scroll-wrapper">
              <DashSummary
                currentLayer = { this.props.currentLayer }
              />
              <DashMapMode
                currentLayer = { this.props.currentLayer }
                mapMode = "moneyAmount"
                mapModeLiteral = "Amount of money"
                changeMapModeFn = { this.changeMapModeFn.bind(this) }
                checked = { this.state.mapMode == "moneyAmount" && true }
              />
              <DashMapMode
                currentLayer = { this.props.currentLayer }
                mapMode = "donorsNumber"
                mapModeLiteral = "Number of donors"
                changeMapModeFn = { this.changeMapModeFn.bind(this) }
                checked = { this.state.mapMode == "donorsNumber" && true }
              />
            </div>
          </div>
        </div>
      </div>
    );  
  }

}

export default Dashboard;
