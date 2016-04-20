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
    this.state = {};
  }

  componentWillMount() {
    layersCollection.fetch().done( () => {
      this.setState({ 'ready': true });
    })
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
    let layer;

    if (this.state.ready) {
      let layers = layersCollection.filter(model => model.attributes.group === this.props.currentMode);

      if (this.props.currentMode === 'donations') {

        layers.forEach( (model) => {
          layer = model.toJSON();
          legendState = layer.active && 'is-open';
        
          switchers.push( <div className="m-dash-layer-switcher" key={ layer.id }> 
            <div className="map-mode">
              <div className="selector-wrapper">
                <input 
                  type ="radio" name="mapMode" checked={ layer.active }
                  id = { layer.id } 
                  onChange = { this.props.changeLayerFn.bind(null, layer.id) }
                />
                <span></span>
                <label htmlFor={ layer.id } className="text text-legend">{ layer.title }</label>
              </div>
              <div className={ 'legend-wrapper ' + legendState }>
                <Legend ref="legend"
                  layerLegend = { layer.legend }
                />
              </div>
            </div> 
          </div> )
        })

      } else {

        layers.forEach( (model) => {
          layer = model.toJSON();
          legendState = layer.active && 'is-open';
        
          switchers.push( 
              <div className={ 'legend-wrapper ' + legendState } key={ layer.id }>
                <Legend ref="legend"
                  layerLegend = { layer.legend }
                />
              </div>)

        })
      }

    }


    return (
      <div>
        { switchers }
      </div>
    )
  }

}

export default DashLayerSwitcher;
