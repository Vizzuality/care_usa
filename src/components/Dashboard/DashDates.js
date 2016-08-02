'use strict';

import './dash-dates-styles.postcss';
import React from 'react';
import moment from 'moment';
import _ from 'underscore';
import utils from '../../scripts/helpers/utils';

class DashboardDates extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }

  componentWillMount() {
    this.setState(utils.checkDevice());
  }

  render() {
    let outputFormat = 'MM·DD·YYYY';
    /* When showing the "Projects" tab of the dashboard, we only want to display
     * the years */
    if(this.props.currentMode === 'projects') outputFormat = 'YYYY';

    let dates;
    if(this.props.filters.from && this.props.filters.to) {
      dates = [
        moment.utc(this.props.filters.from).format(outputFormat),
        moment.utc(this.props.filters.to).format(outputFormat)
      ];
    } else if(this.props.timelineDate) {
      dates = [
        moment.utc(this.props.layer.domain[0], 'YYYY-MM-DD').format(outputFormat),
        moment.utc(+this.props.timelineDate).format(outputFormat)
      ];
    } else {
      dates = [
        moment.utc(this.props.layer.domain[0]).format(outputFormat),
        moment.utc(this.props.layer.domain[1]).format(outputFormat)
      ];
    }

    let dateElem = (
      <div className="dates">
        <span className="start-date text text-legend-s">{ dates[0] }</span>
        <span className="text text-legend-s">&nbsp;-&nbsp;</span>
        <span className="end-date text text-legend-s">{ dates[1] }</span>
      </div>
    );
    if(this.props.currentMode === 'projects') {
      dateElem = (
        <div className="dates">
          <span className="end-date text text-legend-s">{ dates[1] }</span>
        </div>
      );
    }

    if ( this.state.mobile && this.props.currentMode === 'projects' ) {
      return (
        <div>
        </div>
      );
    } else {

      return (
        <div className="m-dash-dates">
          <svg className="icon icon-calendar" onClick={ this.props.toggleFiltersFn } >
            <use xlinkHref="#icon-calendar"></use>
          </svg>
          { dateElem }
        </div>
      );
    };

  }

}

export default DashboardDates;
