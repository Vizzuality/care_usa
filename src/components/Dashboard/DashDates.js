'use strict';

import './dash-dates-styles.postcss';
import React from 'react';
import moment from 'moment';

class DashboardDates extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }

  render() {
    let dates;
    if(this.props.filters.from) {
      dates = (
        <div>
          <span className="start-date text text-legend-s">{ this.props.filters.from ? moment(this.props.filters.from).format('MM·DD·YYYY') : 'NC' }</span>
          <span className="text text-legend-s">&nbsp;-&nbsp;</span>
          <span className="end-date text text-legend-s">{ this.props.filters.to ? moment(this.props.filters.to).format('MM·DD·YYYY') : 'NC' }</span>
        </div>
      );
    } else {
      /* TODO: display something else than 2015 if no date and remove the first
       * part of the condition (maybe) */
      dates = (
        <span className="text text-legend-s">{ this.props.timeline && this.props.timeline.date ? moment(this.props.timeline.date).format('MM·DD·YYYY') : '2015' }</span>
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
