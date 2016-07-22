'use strict';

import './styles.postcss';
import React from 'react';

class CatalystWomen extends React.Component {

  constructor(props) {
    super(props);
  }

  onClickFindMore() {
    /* Google Analytics */
    if (ga && ENVIRONMENT === 'production') {
      ga('send', 'event', 'History', 'Find out more');
    }

    $('html, body').animate({
        scrollTop: $('.l-power-box').offset().top
    }, 500);
  }

  render() {
    return (
      <article className="l-catalyst-women background-image viel">
        <div className="wrap">
          <h1 className="text text-module-title -light">Focusing on Women and Girls as a Catalyst for Change</h1>
          <p className="text text-highlighted -light">Our programs empower communities tomorrow, while meeting the needs of people in crisis today. Through it all, we focus on women and girls, because they bear the brunt of poverty — and hold the key to defeating it. Empowered women create ripples of positive change that lift up everyone around them, including other women, girls, boys, men — entire communities.</p>
          <aside className="learn-more">
            <a href="http://www.care.org/work/womens-empowerment/why-women-girls" className="btn btn-primary" onClick={ this.onClickFindMore.bind(this) } target="_blank">Learn more</a>
          </aside>
        </div>
      </article>
    );
  }

}

export default CatalystWomen;
