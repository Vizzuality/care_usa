'use strict';

import './styles.postcss';
import React from 'react';

class HistoryHeader extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="l-history-header">
        <div className="wrap">
          <p className="back-to-map text text-cta" onClick={ () => this.props.onClose() }>
            <svg className="icon icon-preview">
              <use xlinkHref="#icon-preview"></use>
            </svg>
            Back to the map</p>
          <a className="logo" href="http://www.care.org/" target="_blank">
            <img className="icon icon-logo" src={ require('../../../images/care-logo.png') } />
          </a>
          <div className="aux text text-cta">Back to the map</div>
          <button
                className="btn-menu-toggle"
                onClick={this.props.toggleMenuFn}
              >
                <svg className="icon icon-menu">
                  <use xlinkHref="#icon-menu"></use>
                </svg>
              </button>
        </div>
      </article>
    );
  }

}

export default HistoryHeader;
