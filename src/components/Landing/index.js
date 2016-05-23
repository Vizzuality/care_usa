'use strict';

import './styles.postcss';
import React from 'react';

class Landing extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: true
    };
  }

  getStarted() {
    localStorage.setItem('session', true);
    this.setState({ visible: false });
  }

  render() {
    return (
      <div className={ `l-landing ${ !this.state.visible && 'is-hidden'}` }>
        <div className="landing-background"></div>
        <div className="wrap">
          <h1 className="text text-claim -dark">70 Years of Lasting Change</h1>
          <p className="text text-highlighted -dark">Since 1946 CARE has turned millions of donor gifts into life-changing programs around the world. In one map, see how gifts to CARE deliver lasting change.</p>
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
