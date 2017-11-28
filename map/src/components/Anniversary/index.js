'use strict';

import './styles.postcss';
import $ from 'jquery';
import React from 'react';
import ModalAnniversary from '../ModalAnniversary';
import ModalVideo from '../ModalVideo';

class Anniversary extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVideoOpen: false
    };
  }

  openModalVideo() {
    this.setState({
      modalVideoOpen: true
    });

    /* Google Analytics */
    if (ga && ENVIRONMENT === 'production') {
      ga('send', 'event', 'History', 'Play video');
    }
  }

  onCloseModalVideo() {
    this.setState({
      modalVideoOpen: false
    });

    $('.video').each(function() {
      this.contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
    });
  }

  render() {
    return (
      <div className="m-anniversary">
        <ModalVideo
          visible={this.state.modalVideoOpen}
          onClose={() => this.onCloseModalVideo()}
        />
        <ModalAnniversary
          visible={this.props.visible}
          onClose={this.props.onClose}
          openModalVideo={() => this.openModalVideo()}
          toggleMenuFn={this.props.toggleMenuFn}
          deviceMenuOpen={this.props.deviceMenuOpen}
        />
      </div>
    );
  }
}

export default Anniversary;
