import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import classNames from 'classnames';

import Mui, { Avatar, CircularProgress, List, ListItem, RaisedButton } from 'material-ui';

import './login.scss';

const styles = {
  buttonTwitterIcon: {
    height: '100%',
    display: 'inline-block',
    verticalAlign: 'middle',
    float: 'left',
    paddingLeft: '12px',
    lineHeight: '36px',
    color: 'white',
    fontSize: '28px',
  }
}

export default class LoginPage extends Component {
  render() {
    return (
      <div id="container">
        <div className={classNames('top-bar')}>
          <div className={classNames('top-bar-left')}>
            <div className={classNames('title')}>
              As it Happened
            </div>
          </div>
          <div className={classNames('top-bar-right')}>
            <div className={classNames('node-knockout-button')}>
              <iframe src="http://nodeknockout.com/iframe/lolstack" frameborder={0} scrolling="no" allowtransparency={true} width={115} height={25}>
              </iframe>
            </div>
          </div>
        </div>
        <div className={classNames('info')}>
          <div className={classNames('info-container')}>
            <div className={classNames('video')}>
              <iframe width="560" height="315" src="https://www.youtube.com/embed/xpWOO9nRvIU" frameborder="0"></iframe>
            </div>
            <div className={classNames('message')}>
              <div className={classNames('title')}>
                Create and Share your Stories.
              </div>
              <div className={classNames('sub-title')}>
                Create stories from social media and share them.
              </div>
            </div>
            <div className={classNames('button-container')}>
              <RaisedButton linkButton={true} href="/auth/twitter" primary={true} label="Login with Twitter">
                <i className={classNames('fa fa-twitter')} style={styles.buttonTwitterIcon}></i>

              </RaisedButton>
            </div>
            <div className={classNames('supported-social-media')}>
              <div className={classNames('title')}> Supported Social Media </div>
              <div className={classNames('lolstack-icons')}>
                <i className={classNames('fa fa-twitter-square')}></i>
                <i className={classNames('fa fa-instagram')}></i>
                <i className={classNames('fa fa-vine')}></i>
              </div>
            </div>
          </div>
        </div>
        <div className={classNames('stories')}>

        </div>
      </div>
    );
  }
}
