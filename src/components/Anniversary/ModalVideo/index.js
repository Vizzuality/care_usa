'use strict';

import './styles.postcss';
import Modal from '../../Modal';
import React from 'react';

class ModalVideo extends Modal {

  constructor(props) {
    super(props);
  }

  getContent() {
    return(
      <div className="video-container">
        <iframe 
          className="video"
          src="https://www.youtube.com/embed/AgkhhjVotls" 
          frameBorder="0" 
          allowFullScreen>
        </iframe>
      </div>
    );
  }
}

ModalVideo.propTypes = {
  visible: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func.isRequired
};

export default ModalVideo;