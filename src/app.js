'use strict';

import './app.css';
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render() {
    return (
      '<div>Hello Moto!</div>'
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
