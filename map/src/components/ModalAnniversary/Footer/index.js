'use strict';

import './styles.postcss';
import React from 'react';

class Footer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <footer className="footer-container">
        <div className="footer-holder">
          <section className="social-links">
            <a className="social-links-item facebook-link"><i className="fa fa-facebook icon-facebook" aria-hidden="true"></i></a>
            <a className="social-links-item twitter-link"><i className="fa fa-twitter icon-twitter"></i></a>
            <a className="social-links-item instagram-link"><i className="fa fa-instagram icon-instagram"></i></a>
          </section>
          <section className="footer-menu">
            <a className="footer-link">Map</a><span>❘</span>
            <a href="/stories" className="footer-link">Stories</a>
            <span>❘</span><a href="/about" className="footer-link">About</a>
          </section>
        </div>
      </footer>
    );
  }
}

export default Footer;
