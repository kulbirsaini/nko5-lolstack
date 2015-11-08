import React, { Component } from 'react';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { Avatar, CircularProgress, List, ListItem, ListDivider, RaisedButton, Tabs, Tab } from 'material-ui';

import { getRecentBoards, getPopularBoards } from '../api';

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
        <div id="top-container">
          <div className={classNames('top-bar')}>
            <div className={classNames('top-bar-left')}>
              <div className={classNames('title')}>
                As it Happened
              </div>
            </div>
            <div className={classNames('top-bar-right')}>
              <div className={classNames('node-knockout-button')}>
                <iframe src="http://nodeknockout.com/iframe/lolstack" frameBorder={0} scrolling="no" allowTransparency={true} width={115} height={25}>
                </iframe>
              </div>
            </div>
          </div>
          <div className={classNames('info')}>
            <div className={classNames('info-container')}>
              <div className={classNames('video')}>
                <iframe width="420" height="315" src="https://www.youtube.com/embed/BHDqKYDctCY" frameborder="0"></iframe>
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
                  <i className={classNames('fa fa-youtube')}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={classNames('stories')}>
          <div className={classNames('title')} />
          <StoryTabs />
        </div><br /><br /><br />
        <div style={{ textAlign: 'center', clear: 'both' }}>
          <a href="https://twitter.com/rajamal" title='Amal Raj'>
            <Avatar size={100} src='https://abs.twimg.com/sticky/default_profile_images/default_profile_5_200x200.png' />
          </a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a href="https://twitter.com/_kulbir" title='Kulbir Saini'>
            <Avatar size={100} src='https://pbs.twimg.com/profile_images/446989925494190080/4GOZB0fn.jpeg' />
          </a>
        </div>
      </div>
    );
  }
}


const tabsStyle = {
  color: 'black',
  height: '48px',
  whiteSpace: 'no-wrap',
  display: 'table',
  width: '100%'
};

const tabItemContainerStyle = {
  backgroundColor: 'white',
  color: 'black'
};

const tabStyle = {
  color: '#777',
};

export class StoryTabs extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="stories-container">
        <div className={classNames('title')}>Stories</div>
        <Tabs initialSelectedIndex={0} style={tabsStyle} tabItemContainerStyle={tabItemContainerStyle}>
          <Tab label='Most Popular' value={'0'} style={tabStyle} onActive={this.onTabActive} >
            <MostPopularTab />
          </Tab>
          <Tab label='Latest' value={'1'} style={tabStyle} onActive={this.onTabActive} >
            <LatestTab />
          </Tab>
        </Tabs>
      </div>
    );
  }
};

export class MostPopularTab extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
  }

  initialState() {
    return { boards: [], isLoading: false, error: null };
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    return getPopularBoards(5)
      .then((boards) => this.setState({ boards: boards }))
      .catch((error) => this.setState({ error: 'Error loading popular stories', boards: [] }))
      .then(() => this.setState({ isLoading: false }));
  }

  render() {
    let loadingButton = (
      <div className={classNames('progress')} >
        <CircularProgress size={0.5}/>
      </div>
    );
    if (!this.state.isLoading) {
      loadingButton = '';
    }
    let noStories = this.state.error || 'No popular stories to show';
    if (this.state.isLoading || this.state.boards.length > 0) {
      noStories = '';
    }
    return (
      <div className={classNames(['stories', 'most-popular-stories'])}>
        {loadingButton}
        <StoriesList stories={this.state.boards} />
        {noStories}
      </div>
    );
  }
};

export class LatestTab extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
  }

  initialState() {
    return { boards: [], isLoading: false, error: null };
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    return getRecentBoards(5)
      .then((boards) => this.setState({ boards: boards }))
      .catch((error) => this.setState({ error: 'Error loading recent stories', boards: [] }))
      .then(() => this.setState({ isLoading: false }));
  }

  render() {
    let loadingButton = (
      <div className={classNames('progress')} >
        <CircularProgress size={0.5}/>
      </div>
    );
    if (!this.state.isLoading) {
      loadingButton = '';
    }
    let noStories = this.state.error || 'No recent stories to show';
    if (this.state.isLoading || this.state.boards.length > 0) {
      noStories = '';
    }
    return (
      <div className={classNames(['stories', 'latest-stories'])}>
        {loadingButton}
        <StoriesList stories={this.state.boards} />
        {noStories}
      </div>
    );
  }
};

export class StoryItem extends Component {
  render() {
    const { story } = this.props;
    return (
      <ListItem key={story.id}
          onTouchTap={() => window.location.href = "/boards/"+story.id }
          leftAvatar={<Avatar src={story.user.profile_image_url} />}
          primaryText={story.title}
          secondaryText={ story.description }
          secondaryTextLines={2} />
    );
  }
}

export class StoriesList extends Component {
  render() {
    const { stories } = this.props;

    let storyItems = [];
    stories.forEach((story) => {
      storyItems.push(<StoryItem key={story.id} story={story} />);
      storyItems.push(<ListDivider key={'divider-' + story.id} />);
    });

    return (
      <ReactCSSTransitionGroup transitionName="story-item" transitionEnterTimeout={400} transitionLeaveTimeout={400}>
        <List>
          {storyItems}
        </List>
      </ReactCSSTransitionGroup>
    );
  }
}
