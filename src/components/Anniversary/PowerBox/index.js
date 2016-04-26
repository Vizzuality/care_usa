'use strict';

import './styles.postcss';
import React from 'react';

class PowerBox extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="l-power-box">
        <div className="wrap">
          <aside className="box-image-container">
            <img className="box-image" src={ require('../../../images/halfwidthcontent_box01.png')} />
          </aside>
          <div className="box-text-container">
            <h1 className="text text-module-title -dark">The power of a box</h1>
            <p className="text text-highlighted -dark">In 1946, Regine Binet in Bayeux, France, opened a box that may have saved her life. It contained canned meat, dried milk and other rations. The CARE Package provided desperately needed food and supplies to starving families after World War II. It also carried hope. Regine’s was just one of 100 million CARE Packages delivered to the hands and homes of people across the globe — revealing the power of a box to change the world.</p>
          </div>
        </div>
      </article>
    );
  }

}

export default PowerBox;
