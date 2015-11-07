'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { ReduxRouter } from 'redux-router';
import { Provider } from  'react-redux';

import store from '../store';

export default class Root extends React.Component {
  static renderApp() {
    ReactDOM.render(<Root />, document.getElementById('content'));
  }

  render() {
    return (
      <Provider store={store()}>
        <ReduxRouter />
      </Provider>
    );
  }
}
