'use strict';

import './dash-dates-styles.postcss';
import React from 'react';
import moment from 'moment';
import _ from 'underscore';

class DashboardDates extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }

  render() {
    let dates;
    if(this.props.filters.from && this.props.filters.to) {
      dates = [
        moment.utc(this.props.filters.from).format('MM·DD·YYYY'),
        moment.utc(this.props.filters.to).format('MM·DD·YYYY')
      ];
    } else if(this.props.timelineDate) {
      dates = [
        moment.utc(this.props.layer.domain[0], 'YYYY-MM-DD').format('MM·DD·YYYY'),
        moment.utc(+this.props.timelineDate).format('MM·DD·YYYY')
      ];
    } else {
      dates = [
        moment.utc(this.props.layer.domain[0]).format('MM·DD·YYYY'),
        moment.utc(this.props.layer.domain[1]).format('MM·DD·YYYY')
      ];
    }

    return (
      <div className="m-dash-dates">
        <svg className="icon icon-calendar">
          <use xlinkHref="#icon-calendar"></use>
        </svg>
        <div className="dates">
          <span className="start-date text text-legend-s">{ dates[0] }</span>
          <span className="text text-legend-s">&nbsp;-&nbsp;</span>
          <span className="end-date text text-legend-s">{ dates[1] }</span>
        </div>
     </div>
    );
  }

}

export default DashboardDates;
