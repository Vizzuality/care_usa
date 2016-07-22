'use strict';

import './styles.postcss';
import $ from 'jquery';
import React from 'react';
import ModalVideo from '../ModalVideo';

class BoxVideo extends React.Component {

  constructor(props) {
    super(props);
     this.state = {
      videoOpen: false
    };
  }

  openVideoModal() {
    this.setState({ videoOpen: true });
    document.getElementsByTagName('html')[0].style.overflow = 'hidden';

    /* Google Analytics */
    if (ga && ENVIRONMENT === 'production') {
      ga('send', 'event', 'History', 'Play video');
    }
  }

  closeVideoModal() {
    this.setState({ videoOpen: false });
    document.getElementsByTagName('html')[0].style.overflow = 'auto';
    $('.video').each(function(){
      this.contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*')
    });
  }

  render() {
    return (
      <article className="l-box-video background-image">
        <div className="wrap">
          <h1 className="text text-module-title -primary">The power of a box</h1>
          <aside>
            <a className="btn btn-primary" onClick={ () => this.openVideoModal() }>
              <svg className="icon icon-play" viewBox="0 0 16 21" preserveAspectRatio="xMaxYMid meet"><use xlinkHref="#icon-play"></use></svg>
              Play video
            </a>
          </aside>
        </div>
        <ModalVideo
          visible={ this.state.videoOpen }
          onClose={ this.closeVideoModal.bind(this) }
        />
      </article>
    );
  }

}

export default BoxVideo;
