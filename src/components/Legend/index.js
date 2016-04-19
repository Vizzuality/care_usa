'use strict';

import './styles.postcss';
import React from 'react';
import layersConfig from '../../layersConfig';

class Legend extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
    };
  }

  render() {
    let legend = [];

    layersConfig[this.props.layer].legend.buckets.forEach( (bucket) => {
      let style = { backgroundColor: bucket.color, borderColor: bucket.border }
      legend.push(  
        <li className="legend-item" key={ bucket.color }>
          <span className="bucket" style={ style }></span>
          <span className="text text-legend-s">{ bucket.literal }</span>
        </li>
      )
    })

    return (
      <div className="m-legend">
        <ul>
          { legend }
        </ul>
      </div>
    )
  }

}

export default Legend;
