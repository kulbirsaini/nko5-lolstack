'use strict';

import 'babel-core/polyfill';

import React from 'react';
import ReactDOM from 'react-dom'
import { AppBar, FontIcon, IconButton } from 'material-ui';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import Cards from '../components/cards';

import { getBoard } from '../api';

let homeButtonElement = (
  <IconButton
    tooltip='Home'
    tooltipPosition='bottom-right'>
    <a href='/'>
      <FontIcon className='material-icons' color={'#000'}>home</FontIcon>
    </a>
  </IconButton>
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

  render() {
    return (
      <div id="main">
        <AppBar
          title={this.state.title}
          iconElementLeft={homeButtonElement}
          iconElementRight={this.getBoardEditElement()}
          showMenuIconButton={true} />
        <Cards cards={this.state.cards} />
      </div>
    );
  }
}

window.React = React;
window.onload = () => ReactDOM.render(<Board />, document.getElementById('content'));
