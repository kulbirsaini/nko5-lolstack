'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { TextField, RaisedButton, CircularProgress, List, ListItem, ListDivider, Avatar } from  'material-ui';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import Cards from '../components/cards';
import Logout from '../components/logout';
import { getCard } from '../utils';
import { createBoard, getBoards } from '../api';

import Builder from './home_builder';

import './home.scss';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.fetchStories = this.fetchStories.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  initialState() {
    return {
      isLoading: true,
      boards: [],
      newBoard: null,
      prev_cursor: -1,
      next_cursor: -1,
      count: 10,
      order: 'desc',
      error: null
    }
  }

  componentWillMount() {
    this.fetchStories();
  }

  refresh() {
    this.state = this.initialState();
    this.fetchStories();
  }

  fetchStories() {
    return getBoards(this.state.next_cursor, this.state.count, this.state.order)
      .then((json) => this.setState({ boards: this.state.boards.concat(json.boards), prev_cursor: json.prev_cursor, next_cursor: json.next_cursor, isLoading: false, error: null}))
      .catch((error) => {
        console.log(error);
        this.setState({ error: "Error loading boards. Please try again later", isLoading: false })
      });
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

  onBoardCreation(board) {
    let newBoards = [board, ...this.state.boards];
    this.setState({boards : newBoards, newBoard: board});

  }

  getNewBoardUI() {
    const board = this.state.newBoard;
    if (board) {
      return (
        <div className="new-board">
          <div className="title">Board created. <a href={"/boards/" + board.id}>Edit It</a></div>
          <StoryItem story={board} />
        </div>
      )
    } else {
      return null;
    }
  }

  render() {
    return (
      <div id="main">
        <BoardAppBar
          title={this.state.title}
          rightButton={<Logout />} />
        <div className="container">
          <div id="board-builder" className="board-builder">
            <div className="title"> Create Board </div>
            <Builder onBoardCreation={this.onBoardCreation.bind(this)}/>
          </div>

        </div>
        <div className="new-board-container">
          {this.getNewBoardUI()};
        </div>
        <div className="stories-container">
          {this.getBoardsUI()}
        </div>
      </div>
    );
  }
}


class BoardAppBar extends React.Component {
  render() {
    return (
      <div className="top-bar">
        <div className="logo"> <a href="/" >As it Happened </a> </div>
        <div className="title" >{this.props.title}</div>
        <div className="button">
          {this.props.rightButton}
        </div>
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


window.React = React;
window.onload = () => ReactDOM.render(<Home />, document.getElementById('content'));
