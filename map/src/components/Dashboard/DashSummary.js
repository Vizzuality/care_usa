'use strict';

import './dash-summary-styles.postcss';
import DashSummaryModel from './DashSummaryModel';
import FiltersModel from '../../scripts/models/filtersModel';
import React from 'react';
import _ from 'underscore';
import moment from 'moment';

import utils from '../../scripts/helpers/utils';

class DashSummary extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      totalDonations: null,
      donationsAmount: null,
      projects: null,
      people: null
    };
  }

  componentDidMount() {
    this.dashSummary = new DashSummaryModel();
    this.fetchData(this.state);
  }

  shouldComponentUpdate(nextState) {
    if(this.state.totalDonations !== nextState.totalDonations ||
      this.state.donationsAmount !== nextState.donationsAmount ||
      this.state.projects !== nextState.projects ||
      this.state.people !== nextState.people) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    const startDate = nextProps.filters && nextProps.filters.from || moment.utc(nextProps.layer.domain[0], 'YYYY-MM-DD').toDate();
    const endDate = nextProps.timelineDate || nextProps.filters && nextProps.filters.to;
    const sectors = nextProps.filters && nextProps.filters.sectors || [];
    const region = nextProps.filters && nextProps.filters.region;
    if(this.state.startDate !== startDate || this.state.endDate !== endDate ||
      !this.state.sectors && sectors ||
      this.state.sectors.toString() !== sectors.toString() ||
      this.state.region !== region) {
      this.fetchData({ startDate, endDate, sectors, region });
    }

    this.setState({ startDate, endDate, sectors, region });
  }

  render() {
    let summary;

    if (this.props.currentMode === 'donations') {
      summary = <div className="m-dash-summary">
        <div className="summary-item">
            <p className="text text-dashboard-title">Amount donated</p>
            <span className="number number-l"> ${ utils.numberNotation(this.state.donationsAmount) }</span>
          </div>
          <div className="summary-item">
            <p className="text text-legend-s">Donations </p>
            <span className="number number-m">{ utils.numberNotation(this.state.totalDonations) }</span>
          </div>
        </div>
    } else {
      summary = <div className="m-dash-summary">
        <div className="summary-item">
          <p className="text text-dashboard-title">Total projects</p>
          <span className="number number-l"> { utils.numberNotation(this.state.projects) }</span>
        </div>
        <div className="summary-item">
          <p className="text text-legend-s">People reached </p>
          <span className="number number-m">{ utils.numberNotation(this.state.people) }</span>
        </div>
      </div>
    }

    return (
      <div>
        { summary }
      </div>
    )
  }
}

DashSummary.prototype.fetchData = (function() {
  return _.throttle(function(state) {
    const params = {};

    if(state.startDate) params.start_date = moment.utc(state.startDate).format('YYYY-MM-DD');
    if(state.endDate) params.end_date = moment.utc(state.endDate).format('YYYY-MM-DD');
    if(state.sectors && state.sectors.length) params.sectors_slug = state.sectors;
    if(state.region) params.countries_iso = [ state.region ];

    this.dashSummary.fetch({ data: params })
      .done(res => {
        this.setState({
          totalDonations: res.total_donations,
          donationsAmount: res.total_funds,
          projects: res.total_projects,
          people: res.total_people
        });
      });
  }, 500);
})();

export default DashSummary;
