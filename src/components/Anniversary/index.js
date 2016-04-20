'use strict';

//import './styles.postcss';
import React from 'react';
import CaresPackage from '../CaresPackage';
import PowerBox from '../PowerBox';
import CaresEvolution from '../CaresEvolution';

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

      </div>
    )
  }
}

export default Anniversary;
