'use strict';

import 'babel-core/polyfill';

import React from 'react';
import ReactDOM from 'react-dom'
import { FontIcon, IconButton, RaisedButton } from 'material-ui';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import Cards from '../components/cards';

import './board.scss';

import { getBoard } from '../api';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.getBoardEditElement = this.getBoardEditElement.bind(this);
  }

  getBoardId() {
    const matches = document.location.pathname.match(/^\/boards\/([a-z0-9\-]{36})$/);
    if (!matches || !matches[1]) {
      return null;
    }
    return matches[1];
  }

  initialState() {
    return {
      boardId: this.getBoardId(),
      title: null,
      description: null,
      created_at: null,
      published: false,
      cards: [],
      error: ''
    };
  }

  getBoardEditElement() {
    return (
      <IconButton
        tooltip='More'
        tooltipPosition='bottom-left'>
        <a href={`/boards/${this.state.boardId}/edit`}>
          <FontIcon className='material-icons' color={'#000'}>mode_edit</FontIcon>
        </a>
      </IconButton>
    );
  }

  componentWillMount() {
    if (!this.state.boardId) {
      return this.setState({ error: 'Not found' });
    }

    return getBoard(this.state.boardId)
      .then((json) => {
        this.setState({
          title: json.title,
          description: json.description,
          cards: json.cards,
          published: json.published,
          created_at: json.created_at,
          user: json.user,
          error: null
        });
      })
      .catch((error) => this.setState({ error: 'Error in fetching board' }))
      .then(() => console.log('done'));
  }

  onSave() {

  }

  rightButton() {
    return <RaisedButton primary={true} label="Save" />;
  }

  render() {
    return (
      <div id="main">
        <BoardAppBar
          title={this.state.title}
          rightButton={this.rightButton()} />
        <div className="board">
          <Cards cards={this.state.cards} />
          <div className="chat-box">
          </div>
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


window.React = React;
window.onload = () => ReactDOM.render(<Board />, document.getElementById('content'));
