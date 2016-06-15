'use strict';

import './styles.postcss';
import React from 'react';
import $ from 'jquery';

class CaresPackage extends React.Component {

  constructor(props) {
    super(props);
  }

  onClickFindMore() {
    /* Google Analytics */
    ga && ga('send', 'event', 'History', 'Find out more');

    $('html, body').animate({
        scrollTop: $('.l-power-box').offset().top
    }, 500);
  }

  render() {
    return (
      <article className="l-cares-package background-image viel">
        <div className="wrap">
          <header className="cares-package-header">
            <h2 className="text text-claim -light">70 Years of Lasting Change</h2>
          </header>
          <p className="text text-highlighted -light">CARE was founded in 1945 to rush lifesaving CARE Packages to survivors of World War II. The generosity of millions of Americans turned a simple box into an icon.</p>
          <aside className="find-more">
            <a href="http://www.care.org" className="btn btn-primary" onClick={ this.onClickFindMore.bind(this) } target="_blank">Visit care.org</a>
          </aside>
        </div>
      </article>
    )
  }
}

export default CaresPackage;
