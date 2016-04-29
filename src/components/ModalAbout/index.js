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
        <p className="text text-highlighted -dark">This data shows the sector breadth and reach of CARE's work. It counts individuals directly receiving goods/services from or involved in activities supported by CARE. To avoid double-counting, please refrain from aggregating data across sectors or years</p>
    	</div>
    );
  }
}

ModalAbout.propTypes = {
  visible: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func.isRequired
};

export default ModalAbout;
