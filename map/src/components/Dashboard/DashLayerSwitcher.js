'use strict';

import './dash-layer-switcher-styles.postcss';
import React from 'react';
import $ from 'jquery';
import layersCollection from '../../scripts/collections/layersCollection';

import Legend from '../Legend';

class DashLayerSwitcher extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
  }

  componentDidMount() {
    this._toogleLegend();
  }

  componentDidUpdate() {
    this._toogleLegend();
  }

  shouldComponentUpdate(nextProps) {
    return this.props.currentMode !== nextProps.currentMode ||
      this.props.layer != nextProps.layer;
  }

  _toogleLegend() {
    $('.legend-wrapper').animate({ 'height': 0 + 'px'}, 300 );
    let height = $('.legend-wrapper.is-open .m-legend').height();
    $('.legend-wrapper.is-open').animate({ 'height': height + 12 + 'px'}, 300 );
  }

  render() {
    // Return custom content when we need to filter by sectors
    if (this.props.currentMode === 'stories') return null;
    let switchers = [];
    let legendState;
    let layer;

    let layers = layersCollection.filter(model => model.attributes.category === this.props.currentMode);

    layers.forEach( (model) => {
      layer = model.toJSON();
      legendState = layer.active && 'is-open';

      switchers.push( <div className="m-dash-layer-switcher" key={ layer.slug }>
        <div className="map-mode">
          <div className="selector-wrapper">
            <input
              type ="radio" name="mapMode" checked={ layer.active }
              id = { layer.slug }
              onChange = { this.props.changeLayerFn.bind(null, layer) }
            />
            <span></span>
            <label htmlFor={ layer.slug } className="text text-legend">{ layer.name }</label>
          </div>
          <div className={ 'legend-wrapper ' + legendState }>
            <Legend ref="legend"
              layerLegend = { layer.legend }
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
