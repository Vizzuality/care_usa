'use strict';

import './dash-donation-styles.postcss';
import React from 'react';
import moment from 'moment';
import _ from 'underscore';

class DashboardDonation extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }

  render() {
    return (
      <div className = "m-mydonation-dashboard">
        <div>
          <h1>Thank you { this.props.donationName }! Lasting change is being sent to the world</h1>
        </div>
        <div className="m-dash-summary">
          <div className="summary-item-centered">
            <div className="text-legend-icon"></div>
            <p className="text text-legend-s">Your donation</p>
          </div>
        </div>
        <div className="m-dash-summary">
          <div>
            <p className="text text-legend-title">Donations</p>
            <p><span className="number number-l">{ this.props.donationAmount }</span></p>
          </div>
        </div>
      </div>
    );
  }

}

export default DashboardDonation;
