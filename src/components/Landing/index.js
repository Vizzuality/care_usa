'use strict';

import './styles.postcss';
import React from 'react';

class Landing extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    sessionStorage.setItem('session', true);
  }

  getStarted() {
    document.getElementsByClassName('l-landing')[0].style.display = 'none';
  }

  render() {
    return (
      <div className="l-landing">
        <div className="landing-background"></div>
        <div className="wrap">
          <h1 className="text text-claim -dark">70 years of Lasting Change</h1>
          <p className="text text-highlighted -dark">Morbi vehicula tortor dui. Etiam quis diam eget dolor tempor faucibus. Curabitur nulla augue, dapibus et mollis ac, tempor quis metus. Aenean ut leo dolor.</p>
          <aside className="get-started">
            <a className="btn btn-primary" onClick={ this.getStarted.bind(this) }>Get started</a>
          </aside>
        </div>
        <img className="evolution-image" src={ require('../../images/fullwidthcontent_boxland01.png') } />
     </div>
    );
  }

}

export default Landing;
