'use strict';

import './styles.postcss';
import React from 'react';
import ProjectModel from './../../scripts/models/ProjectModel';

class Infowindow extends React.Component {
  
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    console.log(this.props);
    const projectModel = new ProjectModel();
  }

  render() {
    return(
      <div className="m-infowindow" style={ this.props.position }>
        <button 
          onClick={ this.props.closeFn } 
          className="btn-close"
        >
          <svg className="icon icon-close"><use xlinkHref="#icon-close"></use></svg>
        </button>
        <p>I'm your new Infowindow!</p>
      </div>
    )
  }
};

export default Infowindow;
