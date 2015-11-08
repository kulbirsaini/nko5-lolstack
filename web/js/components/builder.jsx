'use strict';

import React from 'react';
import { TextField, RaisedButton } from  'material-ui';

import Cards from './cards';
import { getCard } from '../utils';
import { createBoard, getBoards } from '../api';

export default class Builder extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.onUrlChange = this.onUrlChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.onGetClick = this.onGetClick.bind(this);
  }

  initialState() {
    return {
      title: '',
      description: '',
      text: '',
      busy: false,
      cards: []
    };
  }

  onUrlChange(event) {
    this.setState({ text: (event.target.value || '').replace(/^\s+|\s+$/g,'') });
  }

  onTitleChange(event) {
    this.setState({ title: (event.target.value || '').replace(/^\s+|\s+$/g,'') });
  }

  onDescriptionChange(event) {
    this.setState({ description: (event.target.value || '').replace(/^\s+|\s+$/g,'') });
  }

  onSubmit() {
    if (!this.state.text) {
      return alert('Enter a url first');
    }
    this.setState({ busy: true });
    getCard(this.state.text, this.state.cards)
      .then((card) => this.setState({ text: '', cards: this.state.cards.concat(card), busy: false }))
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
      .then(() => this.setState({ text: '', busy: false }));
  }

  onSaveClick() {
    this.setState({ busy: true });
    const board = { title: this.state.title, description: this.state.description, cards: this.state.cards };
    return createBoard({ board })
      .then((json) => {
        this.setState(this.initialState());
      })
      .catch((error) => {
        console.log(error);
        alert('Error occurred');
      })
      .then(() => this.setState({ busy: false }));
  }

  onGetClick() {
    return getBoards()
      .then((result) => {
        const board = result.boards[0];
        this.setState({ title: board.title, description: board.description, cards: board.cards });
      })
      .catch(console.log)
      .then(() => console.log('done'));
  }

  render() {
    let saveDisabled = true;
    if (this.state.title && this.state.description && this.state.cards.length > 0) {
      saveDisabled = false;
    }

    return (
      <div>
        <TextField hintText='Title' value={this.state.title} onChange={this.onTitleChange} />
        <TextField hintText='Description' value={this.state.description} onChange={this.onDescriptionChange} />
        <TextField
          hintText='Enter url to a tweet, instagram, facebook post or youtube video'
          value={this.state.text}
          onChange={this.onUrlChange} />
        <RaisedButton label='Add Card' secondary={true} onClick={this.onSubmit} disabled={this.state.busy} />
        <RaisedButton label='Save' secondary={true} onClick={this.onSaveClick} disabled={this.state.busy || saveDisabled} />
        <RaisedButton label='Get' secondary={true} onClick={this.onGetClick} />
        <Cards cards={this.state.cards} />
      </div>
    );
  }
}
