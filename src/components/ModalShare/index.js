'use strict';

import './styles.postcss';
import Modal from '../Modal';
import React from 'react';

class ModalShare extends Modal {

  constructor(props) {
    super(props);
  }

  getContent() {
  	const url = window.location.href;
  	const iframeLink = '<iframe width="600" height="600" src="' + url + '" frameborder="0" allowfullscreen></iframe>';
    return (
    	<div className="wrap">
    		<h1 className="text text-module-title -dark">Share this view</h1>
    		<p className="text text-highlighted -dark">Click and paste HTML to embed in website</p>
    		<aside className="btn-container">
    			<div className="embed-link text text-input -primary">{ iframeLink }</div>
    			<a className="btn btn-primary btn-copy">Copy</a>
    		</aside>
    		<div className="share-links">
				<span className="text text-hightlighted -dark">Share on</span>
				<a href="https://www.facebook.com/carefans"><svg className="icon icon-facebook -primary"><use xlinkHref="#icon-facebook"></use></svg></a>
	            <a href="https://twitter.com/CARE"><svg className="icon icon-twitter -primary"><use xlinkHref="#icon-twitter"></use></svg></a>
	    		<a href="https://plus.google.com/+care"><svg className="icon icon-googleplus -primary"><use xlinkHref="#icon-googleplus"></use></svg></a>	
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
