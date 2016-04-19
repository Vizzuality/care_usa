'use strict';

import './styles.postcss';
import React from 'react';

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
      responsive: [
        {
          breakpoint: 2000,
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
            centerPadding: '40px',
            slidesToShow: 1
          }
        }
      ]
    });
  }

  render() {
    return (
      <article className="l-by-numbers">
        <div className="wrap">
          <div className="box-text-container">
            <h1 className="text text-module-title -light">2015 By the Numbers</h1>
          </div>
          
          <div className="slider">
            <div id="countries" className="slider-element">
              <p className="text text-numbers-xxl -light">95</p>
              <p className="text text-legend-title -light">Countries helped</p>
            </div>
            <div id="projects" className="slider-element">
              <p className="text text-numbers-xxl -light">890</p>
              <p className="text text-legend-title -light">Projects</p>
            </div>
            <div id="people" className="slider-element">
              <p className="text text-numbers-xxl -light">65</p>
              <p className="text text-legend-title -light">Million people reached</p>
            </div>
          </div>
          <button className="btn btn-secondary">annual report</button>

        </div>
      </article>
    )
  }
}

export default Slider;
