import React, { Component } from 'react';

import Pages from 'pages';
import Header from 'components/header/header';
import Footer from 'components/footer.component';
import ReactGA from 'react-ga';
import './style.css';

const GA_ID = process.env.ENVIRONMENT === 'production' ? 'UA-77384250-1' : '';

if (GA_ID) {
  console.log('initializing ga');
  ReactGA.initialize(GA_ID);
}

class App extends Component {
  render() {
    return [
      <Header key="header" />,
      <Pages key="pages" />,
      <Footer key="footer" />
    ];
  }
}

export default App;
