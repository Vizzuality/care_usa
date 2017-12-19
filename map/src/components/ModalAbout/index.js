'use strict';

import './styles.postcss';
import Modal from '../Modal';
import React from 'react';

class ModalAbout extends Modal {

  constructor(props) {
    super(props);
  }

  getContent() {
    return (
    	<div className="wrap m-about">
    		<h1 className="text text-module-title -dark">About the data</h1>
        <h3 className="text text-report-title -dark">Donations</h3>
        <p className="text text-highlighted -dark">This data displays only the subset of donations to CARE that are captured online. It is for exploration only, and should not be interpreted as an official financial record.</p>
        <h3 className="text text-report-title -dark">CARE’s projects</h3>
        <p className="text text-highlighted -dark">The Project-level data shows the number of participants receiving goods/services from or directly involved in activities supported by CARE. The colored arcs shown for each individual country highlight the three most important program sectors for that country each year. Some project participants are involved across multiple sectors but these participants are only counted once in order to avoid duplication.</p>
    	</div>
    );
  }
}

ModalAbout.propTypes = {
  visible: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func.isRequired
};

export default ModalAbout;
