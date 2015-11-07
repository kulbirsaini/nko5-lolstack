'use strict';

import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter } from 'redux-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import actionTransistions from 'redux-history-transitions';
import { Route } from 'react-router';

import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducer from './reducers';

import App from './components/app';

const routes = (
  <Route path='/' component={App} />
);

const history = createBrowserHistory();

const storeEnhancers = [ actionTransistions(history), reduxReactRouter({ routes, createHistory: () => history }) ];
let enhancedCreateStore = compose(...storeEnhancers)(createStore);

const loggerMiddleware = createLogger();

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, loggerMiddleware)(enhancedCreateStore);

export default function appStore(initialState) {
  const store = createStoreWithMiddleware(reducer, initialState);

  if (module.hot) {
    //Enable webpack HMR for reducers
    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers');
      store.replaceReducer(nextReducer);
    });
  }
  return store;
}
