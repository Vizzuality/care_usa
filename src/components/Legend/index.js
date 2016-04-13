'use strict';

import './styles.postcss';
import React from 'react';


class Legend extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
    };
  }

  render() {
    return (
      <div className="m-legend">
        <ul>
          <li className="legend-item">
            <span className="bucket"></span>
            <span>$0 - 100</span>
          </li>
          <li className="legend-item">
            <span className="bucket"></span>
            <span>$100 - 500</span>
          </li>
          <li className="legend-item">
            <span className="bucket"></span>
            <span>$500 - 1000</span>
          </li>
          <li className="legend-item">
            <span className="bucket"></span>
            <span>More than $1000</span>
          </li>
        </ul>
      </div>
    )
  }

}

export default Legend;
