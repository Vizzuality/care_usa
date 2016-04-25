'use strict';

import './styles.postcss';
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
  }

  closeVideoModal() {
    this.setState({ videoOpen: false });
  }

  render() {
    return (
      <article className="l-box-video background-image">
        <div className="wrap">
          <h1 className="text text-module-title -primary">The power of a box</h1>
          <aside>
            <a className="btn btn-primary" onClick={ () => this.openVideoModal() }>
              <svg className="icon icon-play"><use xlinkHref="#icon-play"></use></svg>
              Play video
            </a>
          </aside>
          <ModalVideo
            visible={ this.state.videoOpen }
            onClose={ this.closeVideoModal.bind(this) }
          />
        </div>
      </article>
    );
  }

}

export default BoxVideo;
