'use strict';

//import './styles.postcss';
import React from 'react';
import CaresPackage from '../CaresPackage';
import PowerBox from '../PowerBox';
import CaresEvolution from '../CaresEvolution';
import CatalystWomen from '../CatalystWomen';
import BoxVideo from '../BoxVideo';

class Anniversary extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <CaresPackage />
        <PowerBox />
        <CaresEvolution />
        <CatalystWomen />
        <BoxVideo />

      </div>
    )
  }
}

export default Anniversary;
