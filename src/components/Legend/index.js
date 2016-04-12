'use strict';

import React from 'react';


class Legend extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
    };
  }

  render() {
    return (
      <div className="m-legend"> 
        <p> I'm a legend</p>
      </div>
    )
  }

}

export default Legend;
