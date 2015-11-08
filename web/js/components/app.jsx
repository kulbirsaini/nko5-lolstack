'use strict';

import React from 'react';

import Builder from './builder';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="main">
        <Builder />
      </div>
    );
  }
}
