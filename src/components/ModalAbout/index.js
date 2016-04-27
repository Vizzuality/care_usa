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
    	<div className="wrap">
    		<h1 className="text text-module-title -dark">About the data</h1>
        <p className="text text-highlighted -dark">This data shows the sector breadth and reach of CARE's work. It counts individuals directly receiving goods/services from or involved in activities supported by CARE. To avoid double-counting, please refrain from aggregating data across sectors or years.</p>
    	</div>
    );
  }
}

ModalAbout.propTypes = {
  visible: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func.isRequired
};

export default ModalAbout;
