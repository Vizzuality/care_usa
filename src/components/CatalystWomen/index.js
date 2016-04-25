'use strict';

import './styles.postcss';
import React from 'react';

class CatalystWomen extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="l-catalyst-women background-image viel">
        <div className="wrap">
          <h1 className="text text-module-title -light">Focusing on Women and Girls as a Catalyst for Change</h1>
          <p className="text text-highlighted -light">Our programs empower communities tomorrow, while meeting the needs of people in crisis today. Through it all, we focus on women and girls, because they bear the brunt of poverty — and hold the key to defeating it. Empowered women create ripples of positive change that lift up everyone around them, including other women, girls, boys, men — entire communities.</p>
        </div>
      </article>
    );
  }

}

export default CatalystWomen;
