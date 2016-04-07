'use strict';

import './styles.postcss';
import React from 'react';
import DonorsModel from './../../scripts/models/DonorsModel';


class Infowindow extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      city: null,
      visibility: null
    }

    this.models = {
      donations: new DonorsModel( {lat: this.props.latLong.lat, lng: this.props.latLong.lng })
    };
  }

  componentWillMount() {
    const currentModel = this.checkMap();
    currentModel.fetch().done( () => {
      this.setState({ 
        city: currentModel.attributes[0].city, 
        amount: currentModel.attributes[0].amount,
        visibility: true,
      });
    })
  }

  checkMap() {
    return this.models[this.props.currentMap];
  }

  render() {
    const infowindowClasses = this.state.visibility ? 'm-infowindow' : 'm-infowindow is-hidden'

    return(
      <div className={ infowindowClasses } style={ this.props.position }>
        <button 
          onClick={ this.props.closeFn } 
          className="btn-close"
        >
          <svg className="icon icon-close"><use xlinkHref="#icon-close"></use></svg>
        </button>
        <div className="wrapper">
          <h2>{ this.state.city }</h2>
        </div>
      </div>
    )
  }
};

export default Infowindow;
