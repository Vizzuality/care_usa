'use strict';

import './styles.postcss';
import React from 'react';

import DashTabs from './DashTabs';
import DashSummary from './DashSummary';
import DashLayerSwitcher from './DashLayerSwitcher';
import DashDates from './DashDates';
import DashFilters from './DashFilters';
import DashDonation from './DashDonation';

import utils from '../../scripts/helpers/utils';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      dashboardOpen: true
    };
  }

  componentWillMount() {
    this.setState(utils.checkDevice());
  }

  toogleDashboard() {
    this.setState({ dashboardOpen: !this.state.dashboardOpen })
  }

  render() {
    let tabsMobile;
    let tabsDesktop;
    let layersSwitcher;
    let filtersSwitcher;
    let dashboardClass;

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

    if (!this.state.mobile && !this.props.embed) {
      filtersSwitcher = <div
              className= 'btn btn-third btn-filters-switcher'
              onClick= { this.props.toggleFiltersFn } >
              filters
            </div>
    };

    layersSwitcher = <DashLayerSwitcher
              currentMode = { this.props.currentMode }
              layer = { this.props.layer }
              changeLayerFn= { this.props.changeLayerFn }
            />

    if(this.state.dashboardOpen) {
      dashboardClass = this.state.mobile ? 
          "l-dashboard is-open -mobile" :
          "l-dashboard is-open -pc";
    }
    else dashboardClass = "l-dashboard";

    return (
      <div>
        { tabsMobile }
        <div className={ dashboardClass }>
          <button
            className="btn-dashboard-switcher -left"
            onClick={ this.toogleDashboard.bind(this) }
          >
            <svg className="icon icon-arrowleft"><use xlinkHref="#icon-arrowleft"></use></svg>
          </button>

          <button
            className="btn-dashboard-switcher -bottom"
            onClick={ this.toogleDashboard.bind(this) }
          >
            <svg className="icon icon-arrow"><use xlinkHref="#icon-arrow"></use></svg>
          </button>

          { tabsDesktop }

          <div className="m-dashboard-panel">
            <div className="dashboard-header">

              { this.props.embed &&
                <a href="#" className="btn btn-primary btn-embed">Explore the map</a>
              }

              { !this.props.embed &&
                  <button
                    className="text text-cta btn-filters-switcher"
                    onClick={ this.props.toggleFiltersFn } >
                    filters
                  </button>
              }
              { !this.props.embed &&
                  <a href="http://www.care.org/donate" rel="noreferrer" target="_blank"className="btn btn-contrast -small">
                    Donate
                  </a>
              }

            </div>
            <div className="scroll-wrapper">
              <DashDates
                filters={ this.props.filters }
                timelineDate={ this.props.timelineDate }
                layer={ this.props.layer }
              />
              <DashFilters
                filters={ this.props.filters }
                sectors={ this.props.sectors }
                regions={ this.props.regions }
              />
              <DashSummary
                filters={ this.props.filters }
                layer={ this.props.layer }
                currentMode = { this.props.currentMode }
                timelineDate={ this.props.timelineDate }
              />
              { layersSwitcher }
            </div>
            { filtersSwitcher }
          </div>
        </div>
      </div>
    );
  }

}

export default Dashboard;
