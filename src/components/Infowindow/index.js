'use strict';

import './styles.postcss';
import React from 'react';

class Infowindow extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      city: null,
      visibility: null
    }
  }

  componentWillMount() {
    this.model.fetch().done(() => {
      this.setState({
        city: this.model.attributes.city,
        amount: this.model.attributes.amount,
        visibility: true
      });
    });
  }

  render() {
    const infowindowClasses = this.state.visibility ?
      'm-infowindow' : 'm-infowindow is-hidden';

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

}

export default Infowindow;
