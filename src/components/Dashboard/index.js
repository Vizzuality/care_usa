'use strict';

import './styles.postcss';
import React from 'react';

import DashTabs from './DashTabs';
import DashSummary from './DashSummary';
import DashLayerSwitcher from './DashLayerSwitcher';
import Legend from './../Legend';

import utils from '../../scripts/helpers/utils';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dashboardOpen: true
    };
  }

  componentWillMount() {
    this.setState(utils.checkDevice());
  }

  toogleDashboard() {
    this.setState({ dashboardOpen: !(!!this.state.dashboardOpen) })
  }

  render() {
    let tabsMobile;
    let tabsDesktop;
    let layersSwitcher;
    let legend;

    if ( this.state.mobile || this.state.tablet ) {
      tabsMobile =  <DashTabs
                      currentLayer = { this.props.currentLayer }
                      changeLayerFn = { this.props.changeLayerFn }
                    />
      tabsDesktop = null;
    } else {
      tabsDesktop = <DashTabs
                      currentLayer = { this.props.currentLayer }
                      changeLayerFn = { this.props.changeLayerFn }
                    />
      tabsMobile = null;
    }

    if( this.props.currentLayer == 'donations') {
      layersSwitcher = <DashLayerSwitcher
                currentLayer = { this.props.currentLayer }
                currentSublayer = { this.props.currentSublayer }
                changeSublayerFn= { this.props.changeSublayerFn }
              />
    }

    if( this.props.currentLayer == 'projects') {
      legend = <Legend/>
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
              { layersSwitcher }
              { legend }
            </div>
          </div>
        </div>
      </div>
    );  
  }

}

export default Dashboard;
