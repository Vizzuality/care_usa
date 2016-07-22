'use strict';

import './styles.postcss';
import $ from 'jquery';
import React from 'react';

class BoxVideo extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="l-box-video background-image">
        <div className="wrap">
          <h1 className="text text-module-title -primary">The power of a box</h1>
          <aside>
            <a className="btn btn-primary" onClick={ () => this.props.openModalVideo() }>
              <svg className="icon icon-play"><use xlinkHref="#icon-play"></use></svg>
              Play video
            </a>
          </aside>
        </div>
      </article>
    );
  }

}

export default BoxVideo;
