import React, { Component } from 'react';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { Avatar, CircularProgress, List, ListItem, ListDivider, RaisedButton, Tabs, Tab } from 'material-ui';

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
        </div>
        <div className={classNames('stories')}>
          <div className={classNames('title')} />
          <StoryTabs />
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


const boardsData = [
  {
    id: 1,
    title: 'Hello World',
    subtitle: 'Awesome',
    user: {
      profile_image_url: 'https://pbs.twimg.com/profile_images/589688464871948288/Zr26Iais_400x400.jpg',
      name: 'Sherlock'
    }
  },
  {
    id: 2,
    title: 'Hello World 1',
    subtitle: 'Awesome 1',
    user: {
      profile_image_url: 'https://pbs.twimg.com/profile_images/589688464871948288/Zr26Iais_400x400.jpg',
      name: 'Sherlock'
    }
  },
  {
    id: 3,
    title: 'Hello World 3',
    subtitle: 'Awesome',
    user: {
      profile_image_url: 'https://pbs.twimg.com/profile_images/589688464871948288/Zr26Iais_400x400.jpg',
      name: 'Sherlock 3 '
    }
  },
  {
    id: 4,
    title: 'Hello World 4',
    subtitle: 'Awesome',
    user: {
      profile_image_url: 'https://pbs.twimg.com/profile_images/589688464871948288/Zr26Iais_400x400.jpg',
      name: 'Sherlock 4'
    }
  },
];



export class Stories extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
  }

  initialState() {
    return {
      isLoading: true,
      stories: []
    }
  }

  componentDidMount() {
    this.fetchStories();
  }

  refresh() {
    this.state = this.initialState();
    this.fetchStories();
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className={classNames('stories')}>
          <div className={classNames('progress')} >
            <CircularProgress />
          </div>
        </div>
      );
    } else {
      return (
        <div className={classNames('stories')}>
          Most Popular
        </div>
      );
    }

  }
}


export class MostPopularTab extends Stories {

  fetchStories() {
    setTimeout(() => {
      this.setState({stories: boardsData, isLoading: false});
    }, 2000);
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className={classNames(['stories', 'most-popular-stories'])}>
          <div className={classNames('progress')} >
            <CircularProgress size={0.5} />
          </div>
        </div>
      );
    } else {
      return (
        <div className={classNames(['stories', 'most-popular-stories'])}>
          <StoriesList stories={this.state.stories} />
        </div>
      );
    }

  }
};


export class LatestTab extends Stories {
  fetchStories() {
    setTimeout(() => {
      this.setState({stories: boardsData, isLoading: false});
    }, 2000);
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className={classNames(['stories', 'latest-stories'])}>
          <div className={classNames('progress')} >
            <CircularProgress size={0.5}/>
          </div>
        </div>
      );
    } else {
      return (
        <div className={classNames(['stories', 'latest-stories'])}>
          <StoriesList stories={this.state.stories} />
        </div>
      );
    }
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
          secondaryText={ story.subtitle }
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
