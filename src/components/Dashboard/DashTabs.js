'use strict';

import './styles.postcss';
import React from 'react';

class DashboardTabs extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};

    console.log(this.props);
  }

  render() {
    return (
      <div className="l-dash-tabs">
        <ul className="m-dashboard-tabs">
          <li className={ this.props.currentMap == 'donations' ? 'is-active tab' : 'tab' }>
            <button
              onClick={ this.props.changeMapFn.bind(null, 'donations') }
            >Donors</button></li>
          <li className={ this.props.currentMap == 'projects' ? 'is-active tab' : 'tab' }>
            <button
              onClick={ this.props.changeMapFn.bind(null, 'projects') }
            >Projects</button></li>
        </ul>
     </div>
    );
  }

}

export default DashboardTabs;
