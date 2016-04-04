'use strict';

import 'normalize.css';
import './app.postcss';
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render() {
    return (
      <div>Hello Darling!</div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
