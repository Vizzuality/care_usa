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
          <header className="cares-package-header">
            <h1 className="text text-module-title -light">CARE Package at 70</h1>
            <h2 className="text text-claim -light">70 years of Lasting Change</h2>
          </header>
          <p className="text text-highlighted -light">CARE was founded in 1945 to rush lifesaving CARE Packages to survivors of World War II. The generosity of millions of Americans turned a simple box into an icon.</p>
          <aside className="find-more">
            <a href="#" className="btn btn-primary">Find out more</a>
          </aside>
        </div>
      </article>
    )
  }
}

export default CaresPackage;















