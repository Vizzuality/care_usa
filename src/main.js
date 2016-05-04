'use strict';

import 'normalize.css';
import './main.postcss';

import React  from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Anniversary from './components/Anniversary';
import Header from './components/Header';
import utils from './scripts/helpers/utils';
import MenuDevice from './components/MenuDevice';
import MyDonation from './components/MyDonation';


class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    	currentPage: 'who-cares',
    	device: null,
      menuDeviceOpen: false
    };
  }

  componentWillMount() {
    this.setState(utils.checkDevice());
  }

  toggleMenu() {
	 this.setState({ menuDeviceOpen: !this.state.menuDeviceOpen });
  }

  changePage(page, e) {
	 this.setState({ currentPage: page });
  }

  render() {
  	let menuDevice = null;

    if (this.state.mobile) {
      menuDevice = (
        <MenuDevice
          deviceMenuOpen = { this.state.menuDeviceOpen }
          toggleMenuFn = { this.toggleMenu.bind(this) }
          currentPage = { this.props.currentPage }
        />
      );
    }
    
    return (
    	<div>
	  		<Header
	          currentTab = { this.props.currentTab }
	          toggleMenuFn = { this.toggleMenu.bind(this) }
	          changePageFn = { this.changePage.bind(this) }
	        />
	        { this.props.currentPage === 'who-cares' ? <App />: 
            this.props.currentPage === 'anniversary' ? <Anniversary /> : ''}
	       	{ menuDevice }
        </div>
    );
  }
}

const page = ['app', 'anniversary', 'donation']
  .filter(page => document.getElementById(page))[0];

if (page.length > 0) {
  ReactDOM.render(
    <Main currentTab={ page === 'app' ? 'who-cares' : page }
  	currentPage={ page === 'app' ? 'who-cares' : page }/>,
  	document.getElementById(page));
}

if (page === 'donation') {
  ReactDOM.render(<MyDonation />, document.getElementById('myDonation'));
}


