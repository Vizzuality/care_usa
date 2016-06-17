'use strict';

import 'normalize.css';
import 'select2/dist/css/select2.min.css';
import './main.postcss';

import React  from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import MenuDevice from './components/MenuDevice';
import utils from './scripts/helpers/utils';

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    	currentPage: 'who-cares',
    	device: null,
      menuDeviceOpen: false,
      careHistory: false
    };
  }

  componentWillMount() {
    this.setState(utils.checkDevice());
  }

  changePage(page, e) {
	 this.setState({ currentPage: page });
  }

  toggleMenu() {
   this.setState({ menuDeviceOpen: !this.state.menuDeviceOpen });
  }

  toggleHistory(history) {
    this.setState({ careHistory: history });
    if (arguments.length < 2) {
      this.toggleMenu();
    }
  }

  render() {
    let menuDevice = null;

    if (this.state.tablet || this.state.mobile) {
      menuDevice = (
        <MenuDevice
          deviceMenuOpen = { this.state.menuDeviceOpen }
          toggleMenuFn = { this.toggleMenu.bind(this) }
          toggleHistory = { this.toggleHistory.bind(this) }
          careHistory = { this.state.careHistory }
          currentPage = { this.props.currentPage }
        />
      );
    }

    return (
    	<div>
        <App
          currentTab = { this.props.currentTab }
          toggleMenuFn = { this.toggleMenu.bind(this) }
          toggleHistory = { this.toggleHistory.bind(this) }
          careHistory = { this.state.careHistory }
          changePageFn = { this.changePage.bind(this) }
        />
        { menuDevice }
      </div>
    );
  }
}


ReactDOM.render(
  <Main currentTab='who-cares'
	currentPage='who-cares'/>,
	document.getElementById('app'));




