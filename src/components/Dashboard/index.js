'use strict';

import './styles.postcss';
import React from 'react';

import DashTabs from './DashTabs';
import DashSummary from './DashSummary';
import DashLayerSwitcher from './DashLayerSwitcher';
import DashDates from './DashDates';
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
    let filtersSwitcher;

    if ( this.state.mobile || this.state.tablet ) {
      tabsMobile =  <DashTabs
                      currentMode = { this.props.currentMode }
                      changeModeFn = { this.props.changeModeFn }
                    />
      tabsDesktop = null;
    } else {
      tabsDesktop = <DashTabs
                      currentMode = { this.props.currentMode }
                      changeModeFn = { this.props.changeModeFn }
                    />
      tabsMobile = null;
    }

    if (!this.state.mobile) {
      filtersSwitcher = <div 
              className= 'btn btn-third btn-filters-switcher'
              onClick= { this.props.toggleFiltersFn } >
              <svg className='icon'>
                <use xlinkHref="#icon-filters"></use>
              </svg>
              filters
            </div>
    };

    if( this.props.currentMode == 'donations') {
      layersSwitcher = <DashLayerSwitcher
                currentMode = { this.props.currentMode }
                currentLayer = { this.props.currentLayer }
                changeLayerFn= { this.props.changeLayerFn }
              />
    }

    if( this.props.currentMode == 'projects') {
      legend = <Legend ref="legend"
        layer= { this.props.currentLayer }
      />
    }

    return (
      <div>
        { tabsMobile }
        <div className={ this.state.dashboardOpen ? "l-dashboard is-open" : "l-dashboard" }>
          <button 
            className="btn-dashboard-switcher"
            onClick={ this.toogleDashboard.bind(this) }
          >
            <svg className="icon icon-arrowleft"><use xlinkHref="#icon-arrowleft"></use></svg>
          </button>

          { tabsDesktop }

          <div className="m-dashboard-panel">
            <div className="dashboard-header">
              <button 
                className="text text-cta btn-filters-switcher"
                onClick={ this.props.toggleFiltersFn } >
                filters
              </button>
              <a href="http://www.care.org/donate" rel="noreferrer" target="_blank"className="btn btn-contrast -small">
                Donate
              </a>
            </div>
            <div className="scroll-wrapper">
              <DashDates/>
              <DashSummary
                currentMode = { this.props.currentMode }
              />
              { layersSwitcher }
              { legend }
            </div>
            { filtersSwitcher }
          </div>
        </div>
      </div>
    );  
  }

}

export default Dashboard;
