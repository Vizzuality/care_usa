'use strict';

import './styles.postcss';
import Modal from '../Modal';
import React from 'react';
import Anniversary from '../Anniversary';

class ModalAnniversary extends Modal {

  constructor(props) {
    super(props);
  }

  getClassName() {
    return 'm-anniversary-modal';
  }

  getContent() {
    return (
    	<Anniversary 
        toggleMenuFn = { this.props.toggleMenuFn }
      />
    );
  }
}

ModalAnniversary.propTypes = {
  visible: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func.isRequired
};

export default ModalAnniversary;
