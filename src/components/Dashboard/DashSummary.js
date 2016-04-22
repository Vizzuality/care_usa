'use strict';

import './dash-summary-styles.postcss';
import React from 'react';

class DashSummary extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      totalDonations: '19,823,743',
      donationsAmount: '10,645,846',
      totalCampaigns: '562,430'
    };
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
          <span className="number number-m"> $ { this.state.donationsAmount }</span>
        </div>
      </div>
    )
  }
}

export default DashSummary;
