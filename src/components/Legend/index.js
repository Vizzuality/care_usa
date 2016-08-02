'use strict';

import './styles.postcss';
import React from 'react';
import utils from '../../scripts/helpers/utils';

class Legend extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
    };
  }

  componentWillMount() {
    this.setState(utils.checkDevice());
  }

  render() {
    let legend = [];

    const legendHsh = JSON.parse(this.props.layerLegend);

    legendHsh.buckets.forEach(bucket => {
      let style = { backgroundColor: bucket.color, borderColor: bucket.border };

      if ( this.state.mobile || this.state.tablet) {
        legend.push(
          <li className="legend-item" key={ bucket.color } style={{ width: legendHsh.width}}>
            <span className="text text-legend-s mobile-bucket" style={ style }>{ bucket.literal }</span>
          </li>
        );
      } else {
        legend.push(
        <li className="legend-item" key={ bucket.color }>
          <span className={ bucket.slug + " bucket" } style={ style }></span>
          <span className="text text-legend-s">{ bucket.literal }</span>
        </li>
      );
      }

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
