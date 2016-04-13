'use strict';

import './dash-map-mode-styles.postcss';
import React from 'react';

import Legend from '../Legend';

class DashMapMode extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }

  render() {
    return (
      <div className="m-dash-map-mode"> 
        <div className="map-mode">
          <div className="selector-wrapper">
            <input 
              type="radio" name="mapMode" checked={ this.props.checked }
              id= { this.props.mapMode } 
              onChange = { this.props.changeMapModeFn.bind(null, this.props.mapMode) }
            />
            <label>{ this.props.mapModeLiteral }</label>
          </div>
          <Legend/>
        </div> 
      </div>
    )
  }

}

export default DashMapMode;
