'use strict';

import './dash-dates-styles.postcss';
import React from 'react';

class DashboardTabs extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }

  render() {
    return (
      <div className="m-dash-dates">
        <svg className="icon icon-calendar">
          <use xlinkHref="#icon-calendar"></use>
        </svg>
        <span className="start-date text text-legend-s">20·12·2012</span>
        <span className="text text-legend-s"> - </span>
        <span className="end-date text text-legend-s">20·12·2015</span>
     </div>
    );
  }

}

export default DashboardTabs;
