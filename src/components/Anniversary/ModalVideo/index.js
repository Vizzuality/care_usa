'use strict';

import './styles.postcss';
import Modal from '../../Modal';
import React from 'react';

class ModalVideo extends Modal {

  constructor(props) {
    super(props);

    this.state = {
      open: this.props.visible,
      className: 'modal-video'
    };
  }

  getContent() {
    return(
      <div className="video-container">
        <iframe
          id = "box-video"
          className="video"
          src="https://www.youtube.com/embed/AgkhhjVotls?version=3&enablejsapi=1"
          frameBorder="0"
          allowscriptaccess="always"
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
