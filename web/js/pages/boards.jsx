'use strict';

import 'babel-core/polyfill';

import React from 'react';
import ReactDOM from 'react-dom'
import classNames from 'classnames';
import { AppBar, FontIcon, IconButton, Card, CardHeader, CardMedia, RaisedButton, LinearProgress } from 'material-ui';
import { TextField, CircularProgress, List, ListItem, ListDivider, Avatar } from  'material-ui';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import Qs from 'qs';

import { Logout } from '../components/logout';

import { getBoards } from '../api';
import { renderCard } from '../utils';

import './home.scss';

class BoardAppBar extends React.Component {
  render() {
    return (
      <div className="top-bar">
        <div className="logo"> <a href="/" >As it Happened </a> </div>
        <div className="title" >{this.props.title}</div>
      </div>
    );
  }
};

export class StoryItem extends React.Component {
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

export class StoriesList extends React.Component {
  render() {
    const { stories = [] } = this.props;

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

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.setQueryStrings = this.setQueryStrings.bind(this);
    this.getBoardsUI = this.getBoardsUI.bind(this);
    this.loadBoards = this.loadBoards.bind(this);
  }

  setQueryStrings() {
    let search = document.location.search.replace(/^\?/, '');
    const params = Qs.parse(search);
    this.setState({ next_cursor: params.cursor || -1, order: params.order || 'desc', count: params.count || 10 });
  }

  initialState() {
    return {
      isLoading: false,
      boards: [],
      renderedBoards: [],
      prev_cursor: -1,
      next_cursor: -1,
      count: 10,
      order: 'desc',
      error: ''
    };
  }

  loadBoards() {
    this.setState({ isLoading: true });
    return getBoards(this.state.next_cursor, this.state.count, this.state.order)
      .then((json) => {
        this.setState({
          isLoading: false,
          boards: this.state.boards.concat(json.boards),
          prev_cursor: json.prev_cursor,
          next_cursor: json.next_cursor,
          error: null
        });
      })
      .catch((error) => this.setState({ isLoading: false, error: 'Error in fetching boards' }))
      .then(() => console.log('done'));
  }

  componentWillMount() {
    this.setQueryStrings();
    this.loadBoards();
  }

  getBoardsUI() {
    if (!this.state.isLoading) {
      return (
        <div className={classNames('boards')} >
          <StoriesList stories={this.state.boards} />
        </div>
      );
    } else {
      return (
        <div className={classNames('progress')} >
          <CircularProgress size={0.5} />
        </div>
      );
    }
  }

  render() {

    let loadButton = <RaisedButton onClick={this.loadBoards} label="Load More" secondary={true}/>
    if (this.state.isLoading) {
      loadButton = <LinearProgress mode="indeterminate"  />;
    } else if (this.state.next_cursor === '0' || this.state.next_cursor === 0) {
      loadButton = '';
    }

    return (
      <div id="main">
        <BoardAppBar
          title={this.state.title} />
        <div className="container">
          <div id="board-builder" className="board-builder">
            <div className="title"> Create Board </div>
          </div>

        </div>
        <div className="new-board-container">
        </div>
        <div className="stories-container">
          {this.getBoardsUI()}
        </div>
        <div id="load" style={{ textAlign: 'center' }} >
          {loadButton}
        </div>
      </div>
    );
  }
}

window.React = React;
window.onload = () => ReactDOM.render(<Board />, document.getElementById('content'));
