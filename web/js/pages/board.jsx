'use strict';

import 'babel-core/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { getCard } from '../utils';
import { FontIcon, IconButton, RaisedButton, CircularProgress } from 'material-ui';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import Cards from '../components/cards';

import './board.scss';

import { getBoard, updateBoard } from '../api';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.onTextEntered = this.onTextEntered.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.setStateFromBoardJson = this.setStateFromBoardJson.bind(this);
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
      current_user: window.current_user,
      boardId: this.getBoardId(),
      title: null,
      description: null,
      created_at: null,
      published: false,
      cards: [],
      busy: false,
      saving: false,
      user: {},
      error: ''
    };
  }

  setStateFromBoardJson(json) {
    this.setState({
      title: json.title,
      description: json.description,
      cards: json.cards,
      published: json.published,
      created_at: json.created_at,
      user: json.user,
      error: null
    });
  }

  componentWillMount() {
    if (!this.state.boardId) {
      return this.setState({ error: 'Not found' });
    }

    this.setState({ busy: true });
    return getBoard(this.state.boardId)
      .then((json) => this.setStateFromBoardJson(json))
      .catch((error) => this.setState({ error: 'Error in fetching board' }))
      .then(() => {
        this.setState({ busy: false });
        console.log('done');
      });
  }

  onSaveClick() {
    this.setState({ saving: true });
    const updates = { title: (this.state.title || '').replace(/^\s+|\s+$/g,''), description: (this.state.description || '').replace(/^\s+|\s+$/g,''), cards: this.state.cards };
    return updateBoard(this.state.boardId, { board: updates })
      .then((json) => this.setStateFromBoardJson(json))
      .catch((error) => {
        console.log(error);
        alert('An error occurred while saving!');
      })
      .then(() => this.setState({ saving: false }));
  }

  onTextEntered(text) {
    this.setState({ busy: true });
    let retValue;
    return getCard(text, this.state.cards)
      .then((card) => {
        this.setState({ cards: this.state.cards.concat(card) })
        retValue = true;
      })
      .catch((error) => retValue = error)
      .then(() => {
        this.setState({ busy: false });
        return retValue;
      });
  }

  get chatBox() {
    return this.refs.chatBox;
  }

  rightButton() {
    if (this.state.published) {
      return;
    }
    let disabled = false;
    if (!this.state.title || !this.state.description || this.state.cards.length === 0 || this.state.saving) {
      disabled = true;
    }
    return <RaisedButton primary={true} label="Save" disabled={disabled} onClick={this.onSaveClick} />;
  }

  chatUI() {
    if (this.state.published || !this.state.current_user || !this.state.user || this.state.current_user !== this.state.user.id) {
      return;
    }
    return (
      <div className="chat-box">
        <ChatBox ref="chatBox" onTextEntered={this.onTextEntered} busy={this.state.busy} saving={this.state.saving} />
      </div>
    );
  }

  cardsUI() {
    if (this.state.cards.length > 0) {
      return <Cards cards={this.state.cards} />;
    } else {
      return (
        <div className="empty-card-container">
          Card is empty. Add Links below in the comment box. And dont forget to save using button on top.
        </div>
      );
    }
  }

  render() {
    return (
      <div id="main">
        <BoardAppBar
          title={this.state.title}
          rightButton={this.rightButton()} />
        <div className="board">
          { this.cardsUI() }
          {this.chatUI()}
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

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.onAdd = this.onAdd.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  initialState() {
    return {
      text: '',
      disabled: false,
    }
  }

  onChange(event) {
    this.setState({text: event.target.value });
  }

  onAdd() {
    const { onTextEntered } = this.props;
    if (!this.state.text) {
      alert("Please enter a social media URL or embed HTML code");
      return;
    }
    this.setState({disabled : true});
    onTextEntered(this.state.text)
      .then((retValue) => {
        if (retValue === true) {
          return this.setState({ text: '' });
        }
        if (retValue && retValue.message) {
          if (/Card already exist/i.test(retValue.message) ||
              /Invalid text/i.test(retValue.message) ||
              /Invalid network/i.test(retValue.message) ||
              /Failed to create card/i.test(retValue.message)
            ) {
            return alert(retValue.message);
          }
          console.log(error);
          return alert('Unknown error!');
        }
      })
      .then(() => this.setState({ disabled: false }));
  }

  setText(text) {
    this.setState({text: text});
  }

  render() {
    return (
      <div className="chat-box-container">
        <input type="text" name="url-input" placeholder="Enter URL" value={this.state.text} className="chat-box-input" onChange={this.onChange}/>
        <div className="button-container">
          <RaisedButton primary={true} onClick={this.onAdd} label="ADD" disabled={this.props.busy || this.props.saving || this.state.disabled}/>
        </div>
      </div>
    );
  }
};


window.React = React;
window.onload = () => ReactDOM.render(<Board />, document.getElementById('content'));
