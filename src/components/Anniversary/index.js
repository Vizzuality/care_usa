'use strict';

import './styles.postcss';
import React from 'react';
import Header from '../Header';
import CaresPackage from './CaresPackage';
import PowerBox from './PowerBox';
import CaresEvolution from './CaresEvolution';
import CatalystWomen from './CatalystWomen';
import BoxVideo from './BoxVideo';
import Slider from './Slider';
import Retooling from './Retooling';
import Footer from './Footer';

class Anniversary extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section>
        <Header
          currentTab = { this.props.currentTab }
          toggleMenuFn = { this.props.toggleMenuFn }
          changePageFn = { this.props.changePageFn }
        />
        <CaresPackage />
        <PowerBox />
        <Retooling />
        <CaresEvolution />
        <CatalystWomen />
        <Slider />
        <BoxVideo />
        <Footer />
      </section>
    )
  }
}

export default Anniversary;
