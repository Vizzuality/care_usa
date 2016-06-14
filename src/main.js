'use strict';

import 'normalize.css';
import 'select2/dist/css/select2.min.css';
import './main.postcss';

import React  from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Anniversary from './components/Anniversary';
import utils from './scripts/helpers/utils';

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    	currentPage: 'who-cares',
    	device: null
    };
  }

  componentWillMount() {
    this.setState(utils.checkDevice());
  }

  changePage(page, e) {
	 this.setState({ currentPage: page });
  }

  render() {
    return (
    	<div>
        { this.props.currentPage === 'who-cares' ? <App
          currentTab = { this.props.currentTab }
          changePageFn = { this.changePage.bind(this) }
        />:
        this.props.currentPage === 'anniversary' ? <Anniversary
          currentTab = { this.props.currentTab }
          changePageFn = { this.changePage.bind(this) }
        /> : ''}
      </div>
    );
  }
}

const page = ['app', 'anniversary']
  .filter(page => document.getElementById(page))[0];

if (page.length > 0) {
  ReactDOM.render(
    <Main currentTab={ page === 'app' ? 'who-cares' : page }
  	currentPage={ page === 'app' ? 'who-cares' : page }/>,
  	document.getElementById(page));
}



