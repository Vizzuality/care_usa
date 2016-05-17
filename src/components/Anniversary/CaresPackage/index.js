'use strict';

import './styles.postcss';
import React from 'react';
import $ from 'jquery';

class CaresPackage extends React.Component {

  constructor(props) {
    super(props);
  }

  scrollToContent() {
    $('html, body').animate({
        scrollTop: $('.l-power-box').offset().top
    }, 500);
  }

  render() {
    return (
      <article className="l-cares-package background-image viel">
        <div className="wrap">
          <header className="cares-package-header">
            <h1 className="text text-module-title -light">CARE Package at 70</h1>
            <h2 className="text text-claim -light">70 Years of Lasting Change</h2>
          </header>
          <p className="text text-highlighted -light">CARE was founded in 1945 to rush lifesaving CARE Packages to survivors of World War II. The generosity of millions of Americans turned a simple box into an icon.</p>
          <aside className="find-more">
            <button className="btn btn-primary" onClick={ this.scrollToContent.bind(this) }>Find out more</button>
          </aside>
        </div>
      </article>
    )
  }
}

export default CaresPackage;
