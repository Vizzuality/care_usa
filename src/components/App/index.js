'use strict';

import React  from 'react';
import MainMenu from '../MainMenu';
import MenuDevice from '../MenuDevice';
import TimelineView from '../Timeline';
import Dashboard from '../Dashboard';
import FiltersView from '../Filters';
import Modal from '../Modal';
import MapView from '../Map';
import Router from '../../scripts/Router';

import utils from '../../scripts/helpers/utils';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentMode: 'donations',
      currentLayer: 'amountOfMoney',
      currentPage: 'who-cares',
      device: null,
      menuDeviceOpen: false,
      filtersOpen: false
    }
  }

  componentWillMount() {
    this.router = new Router();
    Backbone.history.start({ pushState: false });
    this.setState(utils.checkDevice());
  }

  componentDidMount() {
    this.initMap();
    this.initTimeline();
  }

  initMap() {
    this.mapView = new MapView({
      el: this.refs.Map,
      currentLayer: this.state.currentLayer,
      state: this.router.params
    });
  }

  initTimeline() {
    this.timeline = new TimelineView({ el: this.refs.Timeline });
    this.filters = new FiltersView({ el: this.refs.Filters });
  }

  toggleMenu() {
    this.setState({ menuDeviceOpen: !this.state.menuDeviceOpen });
  }

  changePage(page, e) {
    this.setState({ currentPage: page });
  }

  changeMapMode(mode, e) {
    let sublayer;

    if (mode == 'donations') {
      sublayer = 'amountOfMoney';
    } else {
      sublayer = 'projects';
    }

    this.setState({ currentMode: mode, currentLayer: sublayer });
    this._updateMap(sublayer);
  }

  changeLayer(layer, e) {
    this.setState({ currentLayer: layer });
    this._updateMap(layer);
  }

  _updateMap(layer) {
    this.mapView.state.set({ 'currentLayer': layer });
  }

  closeFilterModal() {
    this.setState({ filtersOpen: false });
  }

  toogleModalFilter() {
    this.setState({ filtersOpen: ! (!!this.state.filtersOpen) });
  }

  render() {
    let menuDevice = null;

    if (this.state.mobile) {
      menuDevice = (
        <MenuDevice
          deviceMenuOpen = { this.state.menuDeviceOpen }
          toggleMenuFn = { this.toggleMenu.bind(this) }
        />
      );
    }

    return (
      <div className="l-app">
        <div id="header" className="l-header">
          <div className="wrap">
            <a href="/" className="logo">
              <img className="icon icon-logo" src={require('../../images/logo.svg')}></img>
            </a>
            <MainMenu
              currentTab = { this.state.currentPage }
              toggleMenuFn = { this.toggleMenu.bind(this) }
              changePageFn = { this.changePage.bind(this) }
            />
          </div>
        </div>

        <div id="map" className="l-map" ref="Map"></div>

        <Dashboard
          changeModeFn={ this.changeMapMode.bind(this) }
          changeLayerFn={ this.changeLayer.bind(this) }
          currentMode={ this.state.currentMode }
          currentLayer={ this.state.currentLayer }
          toggleFiltersFn={ this.toogleModalFilter.bind(this) }
        />

        <div id="timeline" className="l-timeline m-timeline" ref="Timeline">
          <svg className="btn js-button">
            <use xlinkHref="#icon-play" className="js-button-icon"></use>
          </svg>
          <div className="svg-container js-svg-container"></div>
        </div>

        <Modal visible={ this.state.filtersOpen } onClose={ this.closeFilterModal.bind(this) }>
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
        </Modal>

        <a href="http://www.care.org/donate" rel="noreferrer" target="_blank" id="donate" className="l-donate">
          Donate
        </a>
        { menuDevice }
      </div>
    );
  }

}

export default App;
