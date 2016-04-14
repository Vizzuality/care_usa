'use strict';

import './dash-layer-switcher-styles.postcss';
import React from 'react';

import Legend from '../Legend';

class DashLayerSwitcher extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};

    this.subLayers = [
      { id: 'amountOfMoney', literal: 'Amount of money' },
      { id: 'donorsNumber', literal: 'Number of donors' } 
    ]
  }

  render() {
    let switchers = [];

    this.subLayers.forEach( (layer) => {

      switchers.push( <div className="m-dash-layer-switcher" key={ layer.id }> 
        <div className="map-mode">
          <div className="selector-wrapper">
            <input 
              type ="radio" name="mapMode" checked={ this.props.currentLayer == layer.id }
              id = { layer.id } 
              onChange = { this.props.changeLayerFn.bind(null, layer.id) }
            />
            <label className="text text-legend">{ layer.literal }</label>
          </div>
          <Legend/>
        </div> 
      </div> )

    })

    return (
      <div>
        { switchers }
      </div>
    )
  }

}

export default DashLayerSwitcher;
