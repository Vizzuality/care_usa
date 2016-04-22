'use strict';

//import './styles.postcss';
import React from 'react';
import CaresPackage from '../CaresPackage';
import PowerBox from '../PowerBox';
import CaresEvolution from '../CaresEvolution';
import CatalystWomen from '../CatalystWomen';
import BoxVideo from '../BoxVideo';
import Slider from '../Slider';
import Retooling from '../Retooling';
import Footer from '../Footer';

class Anniversary extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section>
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
