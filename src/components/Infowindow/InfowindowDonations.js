'use strict'

import React from 'react';
import DonorsModel from './../../scripts/models/DonorsModel';

import InfoWindow from './index';

class InfoWindowDonations extends InfoWindow {

  constructor(props) {
    super(props);

    this.state = {
      visibility: null
    }

    this.model = new DonorsModel( {lat: this.props.latLong.lat, lng: this.props.latLong.lng });
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
          <h2>Donations</h2>
        </div>
      </div>
    )
  }
  
}

export default InfoWindowDonations;
