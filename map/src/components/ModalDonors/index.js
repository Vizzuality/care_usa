'use strict';

import './styles.postcss';
import Modal from '../Modal';
import React from 'react';
import DonorsModalModel from './../../scripts/models/DonorsModalModel';

class ModalDonors extends Modal {

  constructor(props) {
    super(props);
  }

  getContent() {
    return (
      <div id="donors-modal-content">
      </div>
    );
  }
}

ModalDonors.propTypes = {
  visible: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func.isRequired
};

export default ModalDonors;
