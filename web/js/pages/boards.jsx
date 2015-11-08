'use strict';

import 'babel-core/polyfill';

import React from 'react';
import ReactDOM from 'react-dom'
import { AppBar, FontIcon, IconButton, Card, CardHeader, CardMedia, RaisedButton, LinearProgress } from 'material-ui';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import Qs from 'qs';

import { getBoards } from '../api';
import { renderCard } from '../utils';

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
    this.setQueryStrings = this.setQueryStrings.bind(this);
    this.getBoardsUI = this.getBoardsUI.bind(this);
    this.loadBoards = this.loadBoards.bind(this);
    this.renderBoards = this.renderBoards.bind(this);
  }

  setQueryStrings() {
    let search = document.location.search.replace(/^\?/, '');
    const params = Qs.parse(search);
    this.setState({ next_cursor: params.cursor || -1, order: params.order || 'desc', count: params.count || 10 });
  }

  initialState() {
    return {
      isFetching: false,
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
    this.setState({ isFetching: true });
    return getBoards(this.state.next_cursor, this.state.count, this.state.order)
      .then((json) => {
        this.setState({
          isFetching: false,
          boards: this.state.boards.concat(json.boards),
          prev_cursor: json.prev_cursor,
          next_cursor: json.next_cursor,
          error: null
        });
      })
      .catch((error) => this.setState({ isFetching: false, error: 'Error in fetching boards' }))
      .then(() => console.log('done'));
  }

  componentWillMount() {
    this.setQueryStrings();
    this.loadBoards();
  }

  componentDidUpdate() {
    this.renderBoards();
  }

  getBoardsUI() {
    return this.state.boards.map((board) => {
      return (
        <Card key={board.id}>
          <CardHeader title={board.title} subtitle={board.description} />
          <CardMedia>
            <div className='card-content'>
              <div id={`${board.cards[0].elementId}-${board.id}`} />
            </div>
          </CardMedia>
        </Card>
      );
    });
  }

  renderBoards() {
    if (this.state.boards.length === this.state.renderedBoards.length) {
      return;
    }
    let renderInstagram = false;
    this.state.boards.forEach((board) => {
      if (this.state.renderedBoards.indexOf(board.id) > -1) {
        return;
      }
      renderCard(board.cards[0], board.id);
      if (board.cards[0].type === 'instagram') {
        renderInstagram = true;
      }
    });
    if (renderInstagram) {
      instgrm.Embeds.process();
    }
    this.setState({ renderedBoards: this.state.boards.map((board) => board.id) });
  }

  render() {

    let loadButton = <RaisedButton onClick={this.loadBoards} label="Load More" secondary={true} />
    if (this.state.isFetching) {
      loadButton = <LinearProgress mode="indeterminate"  />;
    } else if (this.state.next_cursor === '0' || this.state.next_cursor === 0) {
      loadButton = '';
    }

    return (
      <div id="main">
        <AppBar
          title={this.state.title}
          iconElementLeft={homeButtonElement}
          showMenuIconButton={true} />
        {this.getBoardsUI()}
        {loadButton}
      </div>
    );
  }
}

window.React = React;
window.onload = () => ReactDOM.render(<Board />, document.getElementById('content'));
