'use strict';

import './styles.postcss';
import React from 'react';

class Infowindow extends React.Component {
  
  constructor(props) {
    super(props);

    console.log(this.props)
  }

  render() {
    return(
      <div className="m-infowindow" style={ this.props.position }>
        <button onClick={ this.props.closeFn }></button>
        <p>I'm your new Infowindow!</p>
      </div>
    )
  }
};

export default Infowindow;
