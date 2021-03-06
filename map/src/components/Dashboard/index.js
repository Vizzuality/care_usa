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

  togleDashboard() {
    this.setState({ dashboardOpen: !this.state.dashboardOpen })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.donation !== nextProps.donation ||
      this.props.currentMode !== nextProps.currentMode ||
      this.props.layer !== nextProps.layer ||
      this.props.filters !== nextProps.filters ||
      this.props.sectors !== nextProps.sectors ||
      this.props.timelineDate !== nextProps.timelineDate ||
      this.state.dashboardOpen !== nextState.dashboardOpen) {
      return true;
    }

    return false;
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

    /* The layer "people-reached" doesn't support the filters */
    if (!this.state.mobile && !this.props.embed &&
      this.props.layer.slug === 'donations') {
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

    const dashboardClass = this.state.dashboardOpen ?
      this.state.mobile ?
          "l-dashboard is-open -mobile" :
            "l-dashboard is-open -pc" :
          "l-dashboard";

    const iconName = this.state.dashboardOpen ? 'icon-close' : 'icon-arrow';

    return (
      <div>
        { tabsMobile }
        <div className={ dashboardClass }>
          <button
            className="btn-dashboard-switcher -left"
            onClick={ this.togleDashboard.bind(this) }
          >
            <svg className={`icon ${iconName}`}>
              <use xlinkHref={`#${iconName}`} />
            </svg>
          </button>

          <button
            className="btn-dashboard-switcher -bottom"
            onClick={ this.togleDashboard.bind(this) }
          >
            <svg className="icon icon-arrow"><use xlinkHref="#icon-arrow"></use></svg>
          </button>
          <div className="dashboard-inner-wrapper">
            { tabsDesktop }

            <div className="m-dashboard-panel">
              <div className="dashboard-header">

                { this.props.embed &&
                  <a href="#" className="btn btn-primary btn-embed">Explore the map</a>
                }

                { !this.props.embed && this.props.layer.slug !== 'people-reached' &&
                    <button
                      className="btn btn-third -small text text-cta btn-filters-switcher"
                      onClick={ this.props.toggleFiltersFn } >
                      filters
                    </button>
                }
                { !this.props.embed &&
                    <a href="http://my.care.org/site/Donation2?df_id=20646&mfc_pref=T&20646.donation=form1" rel="noreferrer" target="_blank"className="btn btn-contrast -small">
                      Donate
                    </a>
                }

              </div>
             <div className={`scroll-wrapper ${this.props.currentMode}`}>
                <DashDates
                  filters={ this.props.filters }
                  timelineDate={ this.props.timelineDate }
                  layer={ this.props.layer }
                  currentMode = { this.props.currentMode }
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
      </div>
    );
  }

}

export default Dashboard;
