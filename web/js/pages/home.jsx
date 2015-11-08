'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { TextField, RaisedButton, CircularProgress, List, ListItem, ListDivider, Avatar } from  'material-ui';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Cards from '../components/cards';
import { getCard } from '../utils';
import { createBoard, getBoards } from '../api';

import Builder from './home_builder';

import './home.scss';


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

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
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
    }
  }

  componentDidMount() {
    this.fetchStories();
  }

  refresh() {
    this.state = this.initialState();
    this.fetchStories();
  }

  fetchStories() {
    getBoards(this.state.next_cursor, this.state.count, this.state.order)
      .then((boardsData) => {
        console.log(boardsData);
        this.setState({stories: boardsData.boards, isLoading: false});
      })
      .catch((error) => {
        alert("Error loading boards. Please try again later");
      });
  }

  logoutButton() {
    return <RaisedButton link={true} primary={true} label="Logout" />;
  }

  getBoardsUI() {
    if (!this.state.isLoading) {
      return (
        <div className={classNames('boards')} >
          <StoriesList stories={this.state.stories} />
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
    const board = this.state.newBoard || this.state.boards[0]
    if (board) {
      return (
        <div className="new-board">
          <div className="title">Board created. <a href={"/boards/" + board.id}> Edit it <></div>
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
          rightButton={this.logoutButton()} />
        <div className="container">
          <div id="board-builder" className="board-builder">
            <div className="title"> Create Board </div>
            <Builder onBoardCreation={this.onBoardCreation.bind(this)}/>
          </div>

        </div>
        <div class="new-board-container">
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


window.React = React;
window.onload = () => ReactDOM.render(<Home />, document.getElementById('content'));
