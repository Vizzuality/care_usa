'use strict';

import './dash-layer-switcher-styles.postcss';
import React from 'react';
import $ from 'jquery';

import Legend from '../Legend';

class DashLayerSwitcher extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};

    //TODO - take layers from layer config
    this.subLayers = [
      { id: 'amountOfMoney', literal: 'Amount of money' },
      { id: 'donorsNumber', literal: 'Number of donors' } 
    ]
  }

  shouldComponentUpdate(nextProps) {
    /* Just for optimization: don't render if nothing changed */
    if(nextProps.currentLayer !==  this.props.currentLayer) return true;
    return false;
  }

  componentDidMount() {
    this._toogleLegend();
  }

  componentDidUpdate() {
    this._toogleLegend();
  }

  _toogleLegend() {
    $('.legend-wrapper').animate({ 'height': 0 + 'px'}, 200 );
    let height = $('.legend-wrapper.is-open .m-legend').height();
    $('.legend-wrapper.is-open').animate({ 'height': height + 12 + 'px'}, 200 );
  }

  render() {
    let switchers = [];
    let legendState;

    this.subLayers.forEach( (layer) => {
      legendState = this.props.currentLayer == layer.id && 'is-open';
      switchers.push( <div className="m-dash-layer-switcher" key={ layer.id }> 
        <div className="map-mode">
          <div className="selector-wrapper">
            <input 
              type ="radio" name="mapMode" checked={ this.props.currentLayer == layer.id }
              id = { layer.id } 
              onChange = { this.props.changeLayerFn.bind(null, layer.id) }
            />
            <label htmlFor={ layer.id } className="text text-legend">{ layer.literal }</label>
          </div>
          <div className={ 'legend-wrapper ' + legendState }>
            <Legend ref="legend"
              layer= { layer.id }
            />
          </div>
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
