'use strict';

import React from 'react';
import { TextField, RaisedButton } from  'material-ui';

import { getTweetJson } from '../api';

import Cards from './cards';

export default class Builder extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.onUrlChange = this.onUrlChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.findTweetIdInCards = this.findTweetIdInCards.bind(this);
  }

  initialState() {
    return {
      currentUrl: '',
      cards: []
    };
  }

  onUrlChange(event) {
    this.setState({ currentUrl: event.target.value });
  }

  parseUrl(url) {
    const parser = document.createElement('a');
    parser.href = url;
    return {
      hostname: parser.hostname,
      pathname: parser.pathname,
      query: parser.query
    };
  }

  getTweetIdFromUrl(url) {
    const parsedUrl = this.parseUrl(url);
    if (!/twitter\.com$/.test(parsedUrl.hostname)) {
      return null;
    }
    if (!/[a-z_0-9\-]+\/status\/\d+/i.test(parsedUrl.pathname)) {
      return null;
    }
    const matches = parsedUrl.pathname.match(/\/status\/(\d+)/);
    console.log(matches);
    return matches[1];
  }

  findTweetIdInCards(tweetId) {
    return this.state.cards.filter((card) => card.type === 'twitter' && card.tweetId === tweetId).length !== 0;
  }

  onSubmit() {
    if (!this.state.currentUrl) {
      return alert('Enter a url first');
    }
    const tweetId = this.getTweetIdFromUrl(this.state.currentUrl);
    if (this.findTweetIdInCards(tweetId)) {
      this.setState({ currentUrl: '' });
      return alert('Tweet already in cards');
    }
    this.setState({ currentUrl: '', cards: this.state.cards.concat({ type: 'twitter', elementId: 'tweet-' + tweetId, tweetId }) });
  }

  render() {
    return (
      <div>
        <TextField
          hintText='Enter url to a tweet, instagram, facebook post or youtube video'
          value={this.state.currentUrl}
          onChange={this.onUrlChange} />
        <RaisedButton label='Submit' secondary={true} onClick={this.onSubmit} />
        <Cards cards={this.state.cards} />
      </div>
    );
  }
}
