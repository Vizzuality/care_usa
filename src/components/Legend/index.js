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
    let legend = [];

    const legendHsh = JSON.parse(this.props.layerLegend);

    legendHsh.buckets.forEach(bucket => {
      let style = { backgroundColor: bucket.color, borderColor: bucket.border, width: legendHsh.width };
      legend.push(
        <li className="legend-item" key={ bucket.color } style={ style }>
          <span className="text text-legend-s">{ bucket.literal }</span>
        </li>
      );
    });

    if(legendHsh.suffix !== undefined) {
      legend.push(
        <li className="legend-item" key="suffix">
          <span className="bucket icon">
            <img src={legendHsh.suffix.svg}></img>
          </span>
          <span className="text text-legend-s">{legendHsh.suffix.text}</span>
        </li>
      );
    }

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
