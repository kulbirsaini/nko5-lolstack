'use strict';

import React from 'react';
import { RaisedButton } from 'material-ui';

export default class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.logoutHandler = this.logoutHandler.bind(this);
  }

  logoutHandler() {
    window.location.href = '/auth/logout';
  }

  render() {
    return (
      <RaisedButton link={true} primary={true} label="Logout" onClick={this.logoutHandler} />
    );
  }
}
