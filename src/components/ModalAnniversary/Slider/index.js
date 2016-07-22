'use strict';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './styles.postcss';
import React from 'react';
import $ from 'jquery';
import slick from 'slick-carousel';

class Slider extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.setSlider();
  }

  setSlider() {
    $('.slider').slick({
      arrows: false,
      dots: true,
      customPaging: function(slider, i) {
        return '<button type="button" data-role="none" role="button" aria-required="false" tabindex="0"></button>';
      },
      centerMode: true,
      centerPadding: '60px',
      slidesToShow: 3,
      focusOnSelect: true,
      responsive: [
        {
          breakpoint: 1720,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '40px',
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: true
          }
        },
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '0',
            slidesToShow: 1
          }
        }
      ]
    }).on('afterChange', (e, slick, currentSlide) => {
      /* Google Analytics */
      if (ga && ENVIRONMENT === 'production') {
        ga('send', 'event', 'History', 'By Numbers', currentSlide + 1);
      }
    });
  }

  onClickAnnualReport() {
    /* Google Analytics */
    if (ga && ENVIRONMENT === 'production') {
      ga('send', 'event', 'History', 'Annual Report');
    }
  }

  render() {
    return (
      <article className="l-by-numbers">
        <div className="wrap">
          <div className="box-text-container">
            <h1 className="text text-module-title -light">2015 By the Numbers</h1>
          </div>

          <div className="slider">
            <div className="countries slider-element">
              <div className="slider-viel">
              </div>
              <p className="number number-xxl">95</p>
              <p className="text text-legend-title -light">Countries helped</p>
            </div>
            <div className="projects slider-element">
              <div className="slider-viel">
              </div>
              <p className="number number-xxl">890</p>
              <p className="text text-legend-title -light">Projects</p>
            </div>
            <div className="people slider-element">
              <div className="slider-viel">
              </div>
              <p className="number number-xxl">65</p>
              <p className="text text-legend-title -light">Million people reached</p>
            </div>
          </div>
          <aside className="btn-container">
            <a className="btn btn-secondary" href="http://www.care.org/newsroom/annual-reports" target="_blank" onClick={this.onClickAnnualReport.bind(this)}>annual report</a>
          </aside>
        </div>
      </article>
    )
  }
}

export default Slider;
