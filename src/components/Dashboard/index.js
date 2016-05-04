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
      dashboardOpen: this.props.donation ? false : true
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
              filters
            </div>
    };

    layersSwitcher = <DashLayerSwitcher
              layers = { this.state.layers }
              currentMode = { this.props.currentMode }
              currentLayer = { this.props.currentLayer }
              changeLayerFn= { this.props.changeLayerFn }
            />
    const embedElement = this.props.embed ? '-embed-element' : '' ;

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
              { !this.props.embed ?
              <a href="http://www.care.org/donate" rel="noreferrer" target="_blank" className={ `btn btn-contrast -small` }>
                Donate
              </a> :
              <a href="#" className="btn btn-primary btn-embed">Explore the map</a> }
            </div>
            <div className="scroll-wrapper">
              <DashDates
                filters={ this.props.filters }
                timelineDates={ this.props.timelineDates }
                dateRange={ this.props.dateRange }
              />
              <DashFilters
                filters={ this.props.filters }
                sectors={ this.props.sectors }
                regions={ this.props.regions }
              />
              <DashSummary
                filters={ this.props.filters }
                timeline={ this.props.timelineDates }
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
