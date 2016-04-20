'use strict';

import './styles.postcss';
import React from 'react';

class CaresPackage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="l-cares-package background-image viel">
        <div className="wrap">
          <header>
            <h1 className="text text-module-title -light">Care's Package Anniversary</h1>
            <h2 className="text text-claim -light">70 years of Lasting Change</h2>
          </header>
          <p className="text text-highlighted -light">CARE was founded in 1945, when 22 American organizations came together to rush lifesaving CARE Packages to survivors of World War II. Thousands of Americans, including President Harry S. Truman, contributed to the effort.</p>
          <aside className="find-more">
            <a href="#" className="btn btn-primary">Find out more</a>
          </aside>
        </div>
      </article>
    )
  }
}

export default CaresPackage;















