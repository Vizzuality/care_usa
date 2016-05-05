'use strict';

import './styles.postcss';
import Modal from '../Modal';
import FiltersView from '../Filters';
import React from 'react';
import moment from 'moment';

class ModalFilters extends Modal {

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    /* Just for optimization: don't render if nothing changed */
    if(nextProps.visible !==  this.props.visible) {
      if(nextProps.visible) this.filters.updateFilters();
      return true;
    }

    if(nextProps.availableRange !== this.props.availableRange) {
      this.filters.updateAvailableRange(nextProps.availableRange);
    }

    return false;
  }

  getInitialFilters() {
    const routerParams = this.props.routerParams;
    if(!routerParams) return {};

    const res = {};

    if(routerParams.startDate) {
      const date = moment.utc(routerParams.startDate, 'YYYY-MM-DD');
      if(date.isValid()) {
        res['from-day']   = date.format('D');
        res['from-month'] = date.format('M');
        res['from-year']  = date.format('YYYY');
        res.from          = date.toDate();
      }
    }

    if(routerParams.endDate) {
      const date = moment.utc(routerParams.endDate, 'YYYY-MM-DD');
      if(date.isValid()) {
        res['to-day']   = date.format('D');
        res['to-month'] = date.format('M');
        res['to-year']  = date.format('YYYY');
        res.to          = date.toDate();
      }
    }

    if(routerParams.region) {
      res.region = routerParams.region;
    }

    if(routerParams.sectors && routerParams.sectors.length) {
      res.sectors = routerParams.sectors;
    }

    return res;
  }

  componentDidMount() {
    this.filters = new FiltersView({
      el: this.refs.Filters,
      closeCallback: this.props.onClose.bind(this),
      saveCallback: this.props.onSave.bind(this),
      dateRange: this.props.range,
      availableRange: this.props.availableRange,
      initialFilters: this.getInitialFilters()
    });
  }

  getContent() {
    return <div id="filters" className="m-filters" ref="Filters">
      <div>
        <div className="available-range js-available-range text text-legend-s"></div>
        <fieldset className="date date-from">
          <legend className="text -dark text-form-labels">From</legend>
          <div>
            <div>
              <select className="js-from-month" name="from-month">
                <option value="" disabled="disabled">Month</option>
              </select>
            </div>
            <div>
              <select className="js-from-day" name="from-day">
                <option value="" disabled="disabled">Day</option>
              </select>
            </div>
            <div>
              <select className="js-from-year" name="from-year">
                <option value="" disabled="disabled">Year</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset className="date date-to">
          <legend className="text -dark text-form-labels">To</legend>
          <div>
            <div>
              <select className="js-to-month" name="to-month">
                <option value="" disabled="disabled">Month</option>
              </select>
            </div>
            <div>
              <select className="js-to-day" name="to-day">
                <option value="" disabled="disabled">Day</option>
              </select>
            </div>
            <div>
              <select className="js-to-year" name="to-year">
                <option value="" disabled="disabled">Year</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset className="regions">
          <legend className="text -dark text-form-labels">Countries of interest</legend>
          <div>
            <select className="js-regions" name="region">
              <option value="" disabled="disabeld">All regions</option>
            </select>
          </div>
        </fieldset>
      </div>

      <div className="sectors">
        <fieldset>
          <legend className="text -dark text-form-labels">Sectors</legend>
          <div className="js-sectors"></div>
        </fieldset>
      </div>
      <div className="buttons">
        <button type="button" className="btn btn-primary js-apply is-disabled">Apply filters</button>
        <button type="button" className="btn btn-third js-clear is-disabled">Clear filters</button>
      </div>
    </div>;
  }

}

ModalFilters.propTypes = {
  visible: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func.isRequired,
  onSave: React.PropTypes.func.isRequired
};

export default ModalFilters;
