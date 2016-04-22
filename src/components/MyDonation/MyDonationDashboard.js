'use strict';

import '../Dashboard/styles.postcss';
import './style.css';

import React from 'react';
import utils from '../../scripts/helpers/utils';

class MyDonationDashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      amount: props.amount,
      dashboardOpen: true
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  componentWillMount() {
    this.setState(utils.checkDevice());
  }

  toogleDashboard() {
    this.setState({dashboardOpen: !this.state.dashboardOpen})
  }

  render() {
    const toggleButton = (
      <button
        className="btn-dashboard-switcher"
        onClick={ this.toogleDashboard.bind(this) }
      >
        <svg className="icon icon-arrowleft"><use xlinkHref="#icon-arrowleft"></use></svg>
      </button>
    );
    return (
      <div className="m-mydonation-dashboard">
        <div className={ this.state.dashboardOpen ? 'l-dashboard is-open' : 'l-dashboard' }>
          {toggleButton}
          <div className="m-dashboard-panel">
            <div className="scroll-wrapper">
              <div>
                <h1>Thank you { this.state.name }! Lasting change is sending to the world</h1>
              </div>
              <div className="m-dash-summary">
                <div className="summary-item">
                  <p className="text text-legend-s">Your donation </p>
                </div>
              </div>
              <div className="m-dash-summary">
                <div>
                  <p className="text text-legend-title">Donations</p>
                  <p><span className="number number-l">{ this.state.amount }</span></p>
                </div>
              </div>

              <div className="m-dash-layer-switcher">
                <div className="map-mode">
                  <div className="selector-wrapper">
                    <label className="text text-legend">Amount of money</label>
                  </div>
                  <div className="m-legend">
                    <ul>
                      <li className="legend-item">
                        <span className="bucket" style={{backgroundColor: '#dffdfb'}}></span>
                        <span className="text text-legend-s">$0 - 100</span>
                      </li>
                      <li className="legend-item">
                        <span className="bucket" style={{backgroundColor: '#88b8bd'}}></span>
                        <span className="text text-legend-s">$100 - 500</span>
                      </li>
                      <li className="legend-item">
                        <span className="bucket" style={{backgroundColor: '#4f8593'}}></span>
                        <span className="text text-legend-s">$500 - 1000</span>
                      </li>
                      <li className="legend-item">
                        <span className="bucket" style={{backgroundColor: '#182b31'}}></span>
                        <span className="text text-legend-s">More than $1000</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default MyDonationDashboard;
