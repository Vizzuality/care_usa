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
import filtersModel from '../../scripts/models/filtersModel';
import sectorsCollection from '../../scripts/collections/SectorsCollection';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      dashboardOpen: true,
      sectorsReady: false
    };
    this.updateSectors = this.updateSectors.bind(this);
  }

  componentWillMount() {
    this.setState(utils.checkDevice());
  }

  componentDidMount() {
    sectorsCollection.fetch()
      .then((d) => {
        this.setState({ sectorsReady: true })
      });
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
      this.state.sectorsReady !== nextState.sectorsReady ||
      this.state.dashboardOpen !== nextState.dashboardOpen) {
      return true;
    }

    return false;
  }

  updateSectors(e) {
    const name = e.target.name ? e.target.name.replace('sector-', '') : null;
    if (name) {
      const sectorFilters = [...filtersModel.get('sectors')];
      const index = sectorFilters.indexOf(name);
      if (index > -1) {
        sectorFilters.splice(index, 1);
      } else {
        sectorFilters.push(name)
      }
      filtersModel.set({
        sectors: sectorFilters
      }, { validate: true });
    }
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

    let storiesFilters = null;
    if (this.state.sectorsReady && this.props.layer.slug === 'stories') {
      const sectorsModel = filtersModel.get('sectors') || [];
      storiesFilters = <div className="m-filters sidebar">
        <div className="sectors">
          <fieldset>
            {sectorsCollection.toJSON().map((sector) => [
              <input
                key={`inputkey-${sector.slug}`}
                type="checkbox"
                id={`filters-${sector.slug}`}
                name={`sector-${sector.slug}`}
                onChange={this.updateSectors}
                checked={sectorsModel.indexOf(sector.slug) > -1}
              />,
              <label
                key={`labelkey-${sector.slug}`}
                className="text text-cta"
                htmlFor={`filters-${sector.slug}`}
              >
                {sector.name}
              </label>
            ])}
          </fieldset>
        </div>
      </div>
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
                {this.props.layer.slug !== 'stories' &&
                  <DashFilters
                    filters={ this.props.filters }
                    sectors={ this.props.sectors }
                    regions={ this.props.regions }
                  />
                }
                <DashSummary
                  filters={ this.props.filters }
                  layer={ this.props.layer }
                  currentMode = { this.props.currentMode }
                  timelineDate={ this.props.timelineDate }
                />
                { layersSwitcher }
                { storiesFilters }
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
