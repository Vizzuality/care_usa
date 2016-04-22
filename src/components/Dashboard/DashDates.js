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

    if(!_.isEmpty(this.props.timelineDates)) {
      dates = (
        <div>
          <span className="start-date text text-legend-s">{ this.props.timelineDates.from ? moment(this.props.timelineDates.from).format('MM·DD·YYYY') : 'NC' }</span>
          <span className="text text-legend-s">&nbsp;-&nbsp;</span>
          <span className="end-date text text-legend-s">{ this.props.timelineDates.to ? moment(this.props.timelineDates.to).format('MM·DD·YYYY') : 'NC' }</span>
        </div>
      );
    } else if(!_.isEmpty(this.props.filters)) {
      dates = (
        <div>
          <span className="start-date text text-legend-s">{ this.props.filters.from ? moment(this.props.filters.from).format('MM·DD·YYYY') : 'NC' }</span>
          <span className="text text-legend-s">&nbsp;-&nbsp;</span>
          <span className="end-date text text-legend-s">{ this.props.filters.to ? moment(this.props.filters.to).format('MM·DD·YYYY') : 'NC' }</span>
        </div>
      );
    } else {
      dates = (
        <div>
          <span className="start-date text text-legend-s">{ moment(this.props.dateRange[0]).format('MM·DD·YYYY') }</span>
          <span className="text text-legend-s">&nbsp;-&nbsp;</span>
          <span className="end-date text text-legend-s">{ moment(this.props.dateRange[1]).format('MM·DD·YYYY') }</span>
        </div>
      );
    }

    return (
      <div className="m-dash-dates">
        <svg className="icon icon-calendar">
          <use xlinkHref="#icon-calendar"></use>
        </svg>
        { dates }
     </div>
    );
  }

}

export default DashboardDates;
