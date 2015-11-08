import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import classNames from 'classnames';

import './login.scss';

export default class LoginPage extends Component {
  render() {
    return (
      <div id="container">
        <div className={classNames('info')}>
          <div className={classNames('info-container')}>
            <div className={classNames('video')}>
              <iframe width="560" height="315" src="https://www.youtube.com/embed/xpWOO9nRvIU" frameborder="0"></iframe>
            </div>
            <div className={classNames('message')}>
              <div className={classNames('title')}>
                Create and Share your Stories
              </div>
              <div className={classNames('sub-title')}>
                Create stories from social media and share th.
              </div>
            </div>
            <div className={classNames('supported-social-media')}>
              Supported Social Media
              <div className={classNames('lolstack-icons')}>
                <i className={classNames('fa fa-twitter-square')}></i>
                <i className={classNames('fa fa-instagram')}></i>
                <i className={classNames('fa fa-vine')}></i>
              </div>
            </div>
          </div>
        </div>
        <div className={classNames('stories')}>
          <StoryTabs />
        </div>
      </div>
    );
  }
}


export class StoryTabs extends Component {
  render() {
    return (
      <div id="stories">
        Stories
      </div>
    );
  }
}
