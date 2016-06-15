'use strict';

import './styles.postcss';
import React from 'react';

class HistoryHeader extends React.Component {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <article className="l-history-header">
        <div className="wrap">
          <p className="back-to-map text text-cta"><img src="" />Back to CARE's map</p>
          <img src={ require('../../../images/CARE_HORIZ_2c.jpg') } className="history-logo"/>
          <div className="aux text text-cta">Back to CARE's map</div>
        </div>
      </article>
    );
  }

}

export default HistoryHeader;
