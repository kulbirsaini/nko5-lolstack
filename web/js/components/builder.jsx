'use strict';

import React from 'react';
import { TextField, RaisedButton } from  'material-ui';

import Cards from './cards';
import { getCard } from '../utils';

export default class Builder extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.onUrlChange = this.onUrlChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  initialState() {
    return {
      text: '',
      busy: false,
      cards: []
    };
  }

  onUrlChange(event) {
    this.setState({ text: (event.target.value || '').replace(/^\s+|\s+$/g,'') });
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

  render() {
    return (
      <div>
        <TextField
          hintText='Enter url to a tweet, instagram, facebook post or youtube video'
          value={this.state.text}
          onChange={this.onUrlChange} />
        <RaisedButton label='Submit' secondary={true} onClick={this.onSubmit} disabled={this.state.busy} />
        <Cards cards={this.state.cards} />
      </div>
    );
  }
}
