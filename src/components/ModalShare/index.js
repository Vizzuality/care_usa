'use strict';

import './styles.postcss';
import Modal from '../Modal';
import React from 'react';
import Clipboard from 'clipboard';

class ModalShare extends Modal {

  constructor(props) {
    super(props);

    this.state = {
      open: this.props.visible,
      className: 'modal-share'
    };
  }

  onClickCopy() {
    /* Google Analytics */
    ga && ga('send', 'event', 'Share', 'Copy Embed');
  }

  onClickMedia(e) {
    const media = e.currentTarget.getAttribute('data-media');
    /* Google Analytics */
    ga && ga('send', 'event', 'Share', media);
  }

  getContent() {
  	const url = window.location.href;
  	const iframeLink = '<iframe width="600" height="600" src="' + url + '&embed=true" frameborder="0" allowfullscreen></iframe>';
    const shareDescription = 'In one map, see how CARE turns millions of individual donations into lasting change around the world.';
    new Clipboard('.btn-copy');

    return (
    	<div>
    		<h1 className="text text-module-title -dark">Share this view</h1>
    		<p className="text text-highlighted -dark">Click and paste HTML to embed in website</p>
    		<aside className="btn-container">
    			<input id="embed-link" type="text" value={ iframeLink } readOnly="readonly" className="embed-link text text-input -primary" onFocus={ e => e.target.select() }></input>
    			<a className="btn btn-primary btn-copy" data-clipboard-target="#embed-link" onClick={ this.onClickCopy.bind(this) }>Copy</a>
    		</aside>
    		<div className="share-links">
				  <span className="text text-hightlighted -dark">Share on</span>
				  <a target="_blank" rel="noreferrer" data-media="Facebook" href={ "http://www.facebook.com/sharer.php?u=" + url } onClick={ this.onClickMedia.bind(this) }>
            <svg className="icon icon-facebook -primary">
              <use xlinkHref="#icon-facebook"></use>
            </svg>
          </a>
          <a target="_blank" rel="noreferrer" data-media="Twitter" href={ "http://twitter.com/share?text=" + shareDescription + "&url=" + url + "&hashtags=care" } onClick={ this.onClickMedia.bind(this) }>
            <svg className="icon icon-twitter -primary">
              <use xlinkHref="#icon-twitter"></use>
            </svg>
          </a>
	    	  <a target="_blank" rel="noreferrer" data-media="Google+" href={ "https://plus.google.com/share?url=" + url } onClick={ this.onClickMedia.bind(this) }>
            <svg className="icon icon-googleplus -primary">
              <use xlinkHref="#icon-googleplus"></use>
            </svg>
          </a>
	    	</div>
    	</div>
    );
  }
}

ModalShare.propTypes = {
  visible: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func.isRequired
};

export default ModalShare;
