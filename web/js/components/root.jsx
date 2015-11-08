'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';

export default class Root extends React.Component {
  static renderApp() {
    ReactDOM.render(<Root />, document.getElementById('content'));
  }

  render() {
    return (
      <App />
    );
  }
}
