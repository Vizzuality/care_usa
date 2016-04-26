'use strict';

import './styles.postcss';
import React from 'react';

class CaresEvolution extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="l-cares-evolution background-image">
        <div className="wrap">
          <div className="box-text-container">
            <h1 className="text text-module-title -dark">CARE’s Evolution: Striking Poverty at its Roots</h1>
            <p className="text text-highlighted -dark">The CARE Package has evolved dramatically in 70 years and today delivers lasting change through tools that strike at poverty’s roots – and that can’t be contained in a box. We help villages start savings groups and families access health care that keeps them well. We help girls stay in school — and out of forced marriage. With CARE’s help, communities tap into clean water and proper sanitation, women start and grow businesses, farm their land, plan their families, feed their children, overcome disaster and weather a changing climate — revealing the power of today’s CARE Package to change the world.</p>
          </div>
        </div>
        <img className="evolution-image" src={ require('../../../images/fullwidthcontent_boxland01.png')} />
      </article>
    );
  }

}

export default CaresEvolution;

