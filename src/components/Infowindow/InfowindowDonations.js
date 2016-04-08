'use strict'

import React from 'react';
import DonorModel from './../../scripts/models/DonorModel';

import InfoWindow from './index';

class InfoWindowDonations extends InfoWindow {

  constructor(props) {
    super(props);

    this.state = {
      visibility: null
    }

    this.model = new DonorModel( {lat: this.props.latLong.lat, lng: this.props.latLong.lng });
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
          <p>Donations</p>
          <h2>{ this.state.city }</h2>
        </div>
      </div>
    )
  }

}

export default InfoWindowDonations;
