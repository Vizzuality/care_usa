'use strict';

import './styles.postcss';
import Modal from '../Modal';
import React from 'react';

class ModalDonors extends Modal {

  constructor(props) {
    super(props);
  }

  getContent() {
    
    return (
      <div id="donors-modal -hidden">
      	<div  className="wrap">
      		<h1>Donors list</h1>
          <h2> donors</h2>
      	</div>
      </div>
    );
  }
}

ModalDonors.propTypes = {
  visible: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func.isRequired
};

export default ModalDonors;
