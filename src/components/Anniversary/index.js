'use strict';

//import './styles.postcss';
import React from 'react';
import CaresPackage from '../CaresPackage';
import PowerBox from '../PowerBox';

class Anniversary extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <CaresPackage />
        <PowerBox />

      </div>
    )
  }
}

export default Anniversary;
