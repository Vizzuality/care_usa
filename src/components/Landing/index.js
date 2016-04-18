'use strict';

import './styles.postcss';
import React from 'react';

class Landing extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="l-landing">
        <div className="wrap">
          <h1 className="text text-claim -light">70 years of Lasting Change</h1>
          <p className="text text-highlighted -light">Morbi vehicula tortor dui. Etiam quis diam eget dolor tempor faucibus. Curabitur nulla augue, dapibus et mollis ac, tempor quis metus. Aenean ut leo dolor.</p>
          <aside>
            <a href="#" className="btn btn-primary">Get started</a>
          </aside>
        </div>
        <img className="evolution-image" src="./src/images/fullwidthcontent_boxland01.png" />
     </div>
    );
  }

}

export default Landing;
