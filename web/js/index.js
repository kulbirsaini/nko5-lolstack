'use strict';

import 'babel-core/polyfill';

import React from 'react';
import Root from './components/root';

window.React = React;
window.onload = Root.renderApp;
