'use strict';

import './styles.postcss';
import React from 'react';

class Donation extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="l-donation">
        <div className="wrap">
          <h1 className="text text-module-title -light">Help CARE with your gift today</h1>
          <a href="http://my.care.org/site/Donation2?df_id=20646&mfc_pref=T&20646.donation=form1" rel="noreferrer" target="_blank" className="btn btn-secondary">
              Donate
          </a>
        </div>
      </article>
    );
  }
}

export default Donation;

