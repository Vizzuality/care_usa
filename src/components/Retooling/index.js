'use strict';

import './styles.postcss';
import React from 'react';

class Retooling extends React.Component {

  constructor(props) {
    super(props);
  }

  getImages() {
    return [ 'infants', 'household', 'cotton', 'kinitting', 
      'babyfood', 'blanket', 'layette', 'woolensuitting', 'standardfood'
    ];
  }

  getTitles() {
    return [
      'Infant Food Package',
      'Household Linen Package',
      'Cotton Package',
      'Knitting Wool Package',
      'Baby Food Package',
      'Blanket Package',
      'Layette Package',
      'Woolen Suiting Package',
      'Standard Food Package'
    ];
  }

  render() {
    return (
      <article className="l-retooling">
        <div className="wrap">
          <div className="box-text-container">
            <h1 className="text text-module-title -light">Retooling Surplus Rations to Feed a Starving Post-war Europe</h1>
            <p className="text text-highlighted -light">By the end of WWII, Europe and Asia lay in ruins. And millions of U.S. Army ration packs lay unused in a warehouse in the Philippines. CARE purchased 2.8 million of them in early 1946. They were called “10-in-ones,” as each contained enough food to feed 10 men for a day or one man for 10 days — canned meat, raisins, chocolate and other items. Over time, customized CARE Packages better met the dietary preferences and requirements of diverse people.</p>
          </div>
        </div>
        <div className="images-container">
          <div className="retooling-list">
          { this.getImages().map((image, i) => {
            return (
              <div className={ `${image} list-item` } key={i}>
                <svg className={ `icon icon-${image} retooling-small-image` }>
                  <use xlinkHref={ `#icon-${image}` }></use>
                </svg>
                <p className="text text-legend -light">{ this.getTitles()[i] }</p>
              </div>
              );
            })
          }
          </div>
        </div>
      </article>
    );
  }
}

export default Retooling;
