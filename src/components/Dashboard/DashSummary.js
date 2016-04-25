'use strict';

import './dash-summary-styles.postcss';
import DashSummaryModel from './DashSummaryModel';
import FiltersModel from '../../scripts/models/filtersModel';
import React from 'react';

class DashSummary extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      totalDonations: null,
      donationsAmount: null
    };
  }

  componentDidMount() {
    this.dashSummary = new DashSummaryModel();
    this.dashSummary.fetch({})
    .done((result) => {
      this.setState({
        totalDonations: result.total_donations,
        donationsAmount: result.total_funds
      });
    });
  }

  render() {
    return (
      <div className="m-dash-summary">
        <div className="summary-item">
          <p className="text text-legend-title">Donations </p>
          <span className="number number-l">{ this.state.totalDonations }</span>
        </div>
        <div className="summary-item">
          <p className="text text-legend-s">Amount donated </p>
          <span className="number number-m"> ${ this.state.donationsAmount }</span>
        </div>
      </div>
    )
  }
}

export default DashSummary;
