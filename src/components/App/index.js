'use strict';

import React  from 'react';
import MainMenu from '../MainMenu';
import MenuDevice from '../MenuDevice';
import TimelineView from '../Timeline';
import Dashboard from '../Dashboard';
import FiltersView from '../Filters';
import Modal from '../Modal';

import MapView from '../Map';

import utils from '../../scripts/helpers/utils';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'who-cares',
      currentMap: 'donations',
      device: null,
      menuDeviceOpen: false,
    }
  }

  componentWillMount() {
    this.setState(utils.checkDevice());
  }

  componentDidMount() {
    this.map = new MapView({
      mapElement: this.refs.Map,
      currentMap: this.state.currentMap
    });

    this.timeline = new TimelineView({ el: this.refs.Timeline });
    this.filters = new FiltersView({ el: this.refs.Filters });
  }

  toggleMenu() {
    this.setState({ menuDeviceOpen: !this.state.menuDeviceOpen });
  }

  changePage(page, e) {
    this.setState({ currentPage: page });
  }

  changeMap(map, e) {
    this.setState({ currentMap: map });
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
              <img className="icon icon-logo" src={"./src/images/logo.svg"}></img>
            </a>
            <MainMenu
              currentTab = { this.state.currentTab }
              toggleMenuFn = { this.toggleMenu.bind(this) }
              changePageFn = { this.changePage.bind(this) }
            />
          </div>
        </div>

        <div id="map" className="l-map" ref="Map"></div>

        <Dashboard
          changeMapFn={ this.changeMap.bind(this) }
          currentMap={ this.state.currentMap }
        />

        <div id="timeline" className="l-timeline m-timeline" ref="Timeline">
          <svg className="btn js-button">
            <use xlinkHref="#icon-play" className="js-button-icon"></use>
          </svg>
          <div className="svg-container js-svg-container"></div>
        </div>

        <Modal isOpen={true}>
          <div id="filters" className="m-filters" ref="Filters">
            <fieldset className="date">
              <legend>From</legend>
              <div>
                <select className="js-from-day">
                  <option>TODO</option>
                </select>
                <select className="js-from-month">
                  <option>TODO</option>
                </select>
                <select className="js-from-year">
                  <option>TODO</option>
                </select>
              </div>
            </fieldset>

            <fieldset className="date">
              <legend>To</legend>
              <div>
                <select className="js-to-day">
                  <option>TODO</option>
                </select>
                <select className="js-to-month">
                  <option>TODO</option>
                </select>
                <select className="js-to-year">
                  <option>TODO</option>
                </select>
              </div>
            </fieldset>

            <fieldset className="regions">
              <legend>Region of interest</legend>
              <div>
                <svg className="arrow">
                  <use xlinkHref="#icon-arrow"></use>
                </svg>
                <select className="js-to-day">
                  <option disabled="disabeld">All regions</option>
                </select>
              </div>
            </fieldset>

            <div className="sectors">
              <fieldset>
                <legend>Sectors</legend>
                <div>
                  <input type="checkbox" id="filtersSectorTest1" />
                  <label htmlFor="filtersSectorTest1">
                    Test 1
                  </label>
                  <input type="checkbox" id="filtersSectorTest2" />
                  <label htmlFor="filtersSectorTest2">
                    Test 2
                  </label>
                </div>
              </fieldset>
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
