'use strict';

import 'babel-core/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { getCard } from '../utils';
import { FontIcon, IconButton, RaisedButton } from 'material-ui';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import Cards from '../components/cards';

import './board.scss';

import { getBoard } from '../api';

let homeButtonElement = (
  <div className='logo'> <a href="/" >As it Happened </a> </div>
);

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

  get chatBox() {
    return this.refs.chatBox;
  }

  onTextEntered(text) {
    if (!text) {
      return alert('Enter a url first');
    }
    console.log(text);
    this.setState({ busy: true });
    this.chatBox.setDisabled(true);
    getCard(text, this.state.cards)
      .then((card) => {

        this.setState({ cards: this.state.cards.concat(card), busy: false })
        console.log(card, this.refs.chatBox, this.state.cards);
        this.chatBox.setDisabled(false);
        this.chatBox.setText('');
      })
      .catch((error) => {
        if (error && error.message) {
          if (/Card already exist/i.test(error.message) ||
              /Invalid text/i.test(error.message) ||
              /Invalid network/i.test(error.message) ||
              /Failed to create card/i.test(error.message)
            ) {
            return alert(error.message);
          } else {
            return alert('Unknown error');
            console.log(error);
          }
        }
      })
      .then(() => {
        this.chatBox.setText('');
        this.chatBox.setDisabled(false);
        this.setState({ busy: false });
      });
  }

  chatUI() {
    return <ChatBox ref="chatBox" onTextEntered={this.onTextEntered.bind(this)}/>;
  }

  cardsUI() {
    console.log('Cards', this.state.cards);
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
          <div className="chat-box">
            {this.chatUI()}
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

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
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
      alert("Please enter a social media URL");
      return;
    }
    this.setState({disabled : true});
    onTextEntered(this.state.text);
  }

  setDisabled(disabled) {
    console.log('set disabled');
    this.setState({disabled: disabled});
    this.forceUpdate();
  }

  setText(text) {
    this.setState({text: text});
    this.forceUpdate();
  }

  render() {
    let disabled = this.state.disabled;
    return (
      <div className="chat-box-container">
        <input type="text" name="url-input" placeholder="Enter URL" value={this.state.text} className="chat-box-input" onChange={this.onChange.bind(this)}/>
        <div className="button-container">
          <RaisedButton primary={true} onClick={this.onAdd.bind(this)} label="ADD" disabled={disabled}/>
        </div>
      </div>
    );
  }
};


window.React = React;
window.onload = () => ReactDOM.render(<Board />, document.getElementById('content'));
