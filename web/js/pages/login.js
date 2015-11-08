'use strict';

import 'babel-core/polyfill';

import React, { Component } from 'react';
import ReactDOM from 'react-dom'

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import LoginPage from './login_page';


window.React = React;
window.onload = renderLoginPage;

function renderLoginPage() {
  ReactDOM.render(<LoginPage />, document.getElementById('content'));
}
