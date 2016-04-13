'use strict';

import './dash-summary-styles.postcss';
import React from 'react';

class DashSummary extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      totalDonations: 19823743,
      donationsAmount: 10645846,
      totalCampaigns: 562430
    };
  }

  render() {
    return (
      <div className="m-dash-summary">  
        <div className="summary-item">
          <p className="text text-module-title">Donations </p>
          <span className="number number-l">{ this.state.totalDonations }</span>
        </div>
        <div className="summary-item">
          <p className="text text-legend">Amount donated </p>
          <span className="number number-m"> $ { this.state.donationsAmount }</span>
        </div>
        <div className="summary-item">
          <p className="text text-legend">Campaigns </p>
          <span className="number number-m">{ this.state.totalCampaigns }</span>
        </div>
      </div>
    )
  }

}

export default DashSummary;
