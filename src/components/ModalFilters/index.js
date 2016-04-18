'use strict';

import './styles.postcss';
import Modal from '../Modal';
import FiltersView from '../Filters';
import React from 'react';

class ModalFilters extends Modal {

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    /* Just for optimization: don't render if nothing changed */
    if(nextProps.visible !==  this.props.visible) return true;
    return false;
  }

  componentDidMount() {
    this.filters = new FiltersView({
      el: this.refs.Filters,
      closeCallback: this.props.onClose.bind(this)
    });
  }

  render() {
    return (
      <div className={ 'm-modal ' + ( this.state.open ? '' : '-hidden') } onClick={this.close.bind(this)}>
        <div className="content" ref="content">
          <svg className="close-button" onClick={this.close.bind(this)} ref="closeButton">
            <use xlinkHref="#icon-close"></use>
          </svg>
          <div id="filters" className="m-filters" ref="Filters">
            <div>
              <fieldset className="date date-from">
                <legend className="text -dark text-form-labels">From</legend>
                <div>
                  <div>
                    <svg className="arrow">
                      <use xlinkHref="#icon-arrow"></use>
                    </svg>
                    <select className="js-from-day" name="from-day">
                      <option value="" disabled="disabled">Day</option>
                    </select>
                  </div>
                  <div>
                    <svg className="arrow">
                      <use xlinkHref="#icon-arrow"></use>
                    </svg>
                    <select className="js-from-month" name="from-month">
                      <option value="" disabled="disabled">Month</option>
                    </select>
                  </div>
                  <div>
                    <svg className="arrow">
                      <use xlinkHref="#icon-arrow"></use>
                    </svg>
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
                    <svg className="arrow">
                      <use xlinkHref="#icon-arrow"></use>
                    </svg>
                    <select className="js-to-day" name="to-day">
                      <option value="" disabled="disabled">Day</option>
                    </select>
                  </div>
                  <div>
                    <svg className="arrow">
                      <use xlinkHref="#icon-arrow"></use>
                    </svg>
                    <select className="js-to-month" name="to-month">
                      <option value="" disabled="disabled">Month</option>
                    </select>
                  </div>
                  <div>
                    <svg className="arrow">
                      <use xlinkHref="#icon-arrow"></use>
                    </svg>
                    <select className="js-to-year" name="to-year">
                      <option value="" disabled="disabled">Year</option>
                    </select>
                  </div>
                </div>
              </fieldset>

              <fieldset className="regions">
                <legend className="text -dark text-form-labels">Region of interest</legend>
                <div>
                  <svg className="arrow">
                    <use xlinkHref="#icon-arrow"></use>
                  </svg>
                  <select className="js-region" name="region">
                    <option value="" disabled="disabeld">All regions</option>
                  </select>
                </div>
              </fieldset>
            </div>

            <div className="sectors">
              <fieldset>
                <legend className="text -dark text-form-labels">Sectors</legend>
                <div>
                  <input type="checkbox" id="filtersSectorTest1" name="sector-test1" />
                  <label className="text text-cta" htmlFor="filtersSectorTest1">
                    Test 1
                  </label>
                  <input type="checkbox" id="filtersSectorTest2" name="sector-test2" />
                  <label className="text text-cta" htmlFor="filtersSectorTest2">
                    Test 2
                  </label>
                  <input type="checkbox" id="filtersSectorTest3" name="sector-test3" />
                  <label className="text text-cta" htmlFor="filtersSectorTest3">
                    Test 3
                  </label>
                  <input type="checkbox" id="filtersSectorTest4" name="sector-test4" />
                  <label className="text text-cta" htmlFor="filtersSectorTest4">
                    Test 4
                  </label>
                  <input type="checkbox" id="filtersSectorTest5" name="sector-test5" />
                  <label className="text text-cta" htmlFor="filtersSectorTest5">
                    Test 5
                  </label>
                </div>
              </fieldset>
            </div>
            <div className="buttons">
              <button type="button" className="button-apply js-apply">Apply filters</button>
              <button type="button" className="button-clear js-clear">Clear filters</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

ModalFilters.propTypes = {
  visible: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func.isRequired
};

export default ModalFilters;
