'use strict';

import './dash-summary-styles.postcss';
import React from 'react';

import Legend from '../Legend';

class DashMapMode extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
    };
  }

  render() {
    return (
      <div className="m-dash-map-mode"> 
        <div className="map-mode">
          <input type="checkbox" id="moneyAmount"/>
          <label>Amount of money</label>
          <Legend/>
        </div> 
      </div>
    )
  }

}

export default DashMapMode;
