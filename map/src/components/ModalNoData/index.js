'use strict';

import './styles.postcss';
import React from 'react';
import moment from 'moment';
import utils from '../../scripts/helpers/utils';

class ModalNoData extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      noData: false,
      mode: 'cancel'
    };
  }

  componentWillReceiveProps(nextProps) {
    if(!nextProps.filtersOpen && nextProps.filters.from && nextProps.filters.to &&
      !utils.rangesIntersect(nextProps.domain.map(date => moment.utc(date, 'YYYY-MM-DD').toDate()),
        [ nextProps.filters.from, nextProps.filters.to ],
        (a, b) => +a - (+b))
      ) {

      /* Case where the user switches with a tab which doesn't have data for
       * the date filters */
      if(this.props.currentMode !== nextProps.currentMode) {
        this.setState({
          noData: true,
          mode: 'back'
        });
      }
      /* Case where the user filters with date for which we don't have data */
      else {
        this.setState({
          noData: true,
          mode: 'cancel'
        });
      }

      return;
    }

    /* We don't detect any issue, we have data */
    this.setState({
      noData: false
    });
  }

  onChangeFilters() {
    this.setState({ noData: false });
    this.props.onChangeFilters();
  }

  onGoBack() {
    this.props.onGoBack();
  }

  onCancel() {
    this.props.onCancel();
  }

  render() {
    let leftButton = <button className="btn btn-third" onClick={ this.onGoBack.bind(this) }>Back to donations</button>;
    if(this.state.mode === 'cancel') {
      leftButton = <button className="btn btn-third" onClick={ this.onCancel.bind(this) }>Cancel</button>;
    }

    return (
      <div className={ 'm-modal-no-data ' + (this.state.noData ? '' : '-hidden') }>
        <div className="content" ref="content">
        <p className="text text-highlighted -dark">We are sorry but we do not have data for the dates you have selected. Please select one of the options below and continue exploring.</p>
        <div className="buttons">
          { leftButton }
          <button className="btn btn-third" onClick={ this.onChangeFilters.bind(this) }>Change filters</button>
        </div>
        </div>
      </div>
    );
  }

}

export default ModalNoData;
