'use strict';

import React from 'react';
import Qs from 'qs';
import { TextField, RaisedButton } from  'material-ui';

import { getTweetJson, getInstagramJson } from '../api';

import Cards from './cards';

export default class Builder extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.onUrlChange = this.onUrlChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.findElementIdInCards = this.findElementIdInCards.bind(this);
    this.getCardForText = this.getCardForText.bind(this);
    this.promisedGetCardForText = this.promisedGetCardForText.bind(this);
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

  parseUrl(url) {
    const parser = document.createElement('a');
    parser.href = url;
    return {
      hostname: parser.hostname,
      pathname: parser.pathname,
      query: (parser.search || '').replace(/^\?/, '')
    };
  }

  findElementIdInCards(elementId) {
    return this.state.cards.filter((card) => card.elementId === elementId).length !== 0;
  }

  detectTextType(text) {
    if (
      text.indexOf('<blockquote') > -1 ||
      text.indexOf('<a ') > -1 ||
      text.indexOf('<iframe ') > -1
      ) {
      return 'block';
    }
    return 'url';
  }

  detectNetwork(text, type) {
    if (type === 'block') {
      if (
        text.indexOf(' class="twitter-tweet" ') > -1 ||
        text.indexOf(' class="twitter-video" ') > -1 ||
        text.indexOf(' class="twitter-moment" ') > -1 ||
        text.indexOf(' class="twitter-timeline" ') > -1 ||
        text.indexOf(' class="twitter-grid" ') > -1
        ) {
        return 'twitter';
      }
      if (/\ssrc="https:\/\/vine\.co\/v\//i.test(text)) {
        return 'vine';
      }
      if (text.indexOf(' class="instagram-media" ') > -1) {
        return 'instagram';
      }
      if (/src="https\:\/\/www\.youtube\.com\/embed\/([a-z0-9_\-]{11})"/i.test(text)) {
        return 'youtube';
      }
    }
    if (type === 'url') {
      const parsedUrl = this.parseUrl(text);
      if (parsedUrl.hostname === 'twitter.com' || parsedUrl.hostname === 'www.twitter.com') {
        return 'twitter';
      }
      if (parsedUrl.hostname === 'vine.co') {
        return 'vine';
      }
      if (parsedUrl.hostname === 'instagr.am' || parsedUrl.hostname === 'instagram.com') {
        return 'instagram';
      }
      if (parsedUrl.hostname.indexOf('youtube.com') > -1 || parsedUrl.hostname.indexOf('youtu.be') > -1) {
        return 'youtube';
      }
    }
  }

  getCardForText(text, type, network) {
    if (network === 'twitter') {
      if (type === 'block') {
        if (text.indexOf(' class="twitter-tweet" ') > -1) {
          let matches = text.match(/<a href="https:\/\/twitter.com\/[^\/]+\/status\/(\d+)">/);
          if (!matches || !matches[1]) {
            return null;
          }
          const elementId = 'twitter-tweet-' + matches[1];
          return { type: 'twitter', elementId: elementId, render: () => twttr.widgets.createTweet(matches[1], document.getElementById(elementId), { align: 'left' }) };
        }
        if (text.indexOf(' class="twitter-video" ') > -1) {
          let matches = text.match(/<a href="https:\/\/twitter.com\/[^\/]+\/status\/(\d+)">/);
          if (!matches || !matches[1]) {
            return null;
          }
          const elementId = 'twitter-video-' + matches[1];
          return { type: 'twitter', elementId: elementId, render: () => twttr.widgets.createVideo(matches[1], document.getElementById(elementId), { align: 'left' }) };
        }
        if (text.indexOf(' class="twitter-moment" ') > -1) {
          let matches = text.match(/href="https:\/\/twitter.com\/i\/moments\/(\d+)">/);
          if (!matches || !matches[1]) {
            return null;
          }
          const elementId = 'twitter-moment-' + matches[1];
          return { type: 'twitter', elementId: elementId, render: () => twttr.widgets.createMoment(matches[1], document.getElementById(elementId), { width: 400, align: 'left' }) };
        }
        if (text.indexOf(' class="twitter-timeline" ') > -1) {
          let matches = text.match(/\sdata-widget-id="(\d+)"/);
          if (!matches || !matches[1]) {
            return null;
          }
          const elementId = 'twitter-timeline-' + matches[1];
          return { type: 'twitter', elementId: elementId, render: () => twttr.widgets.createTimeline(matches[1], document.getElementById(elementId), { tweetLimit: 4, align: 'left' }) };
        }
        if (text.indexOf(' class="twitter-grid" ') > -1) {
          let matches = text.match(/href="https:\/\/twitter.com\/[^\/]+\/timelines\/(\d+)">/);
          if (!matches || !matches[1]) {
            return null;
          }
          const elementId = 'twitter-timeline-' + matches[1];
          return { type: 'twitter', elementId: elementId, render: () => twttr.widgets.createGridFromCollection(matches[1], document.getElementById(elementId), { limit: 4, width: 400, align: 'left' }) };
        }
      }
      if (type === 'url') {
        const parsedUrl = this.parseUrl(text);
        const pathname = parsedUrl.pathname;

        if (/\/status\//.test(pathname)) {
          const matches = pathname.match(/\/status\/(\d+)/);
          if (!matches || !matches[1]) {
            return null;
          }
          const elementId = 'twitter-tweet-' + matches[1];
          return { type: 'twitter', elementId: elementId, render: () => twttr.widgets.createTweet(matches[1], document.getElementById(elementId), { align: 'left' }) };
        }
        if (/\/i\/moments\/\d+/.test(pathname)) {
          const matches = pathname.match(/\/i\/moments\/(\d+)/);
          if (!matches || !matches[1]) {
            return null;
          }
          const elementId = 'twitter-moment-' + matches[1];
          return { type: 'twitter', elementId: elementId, render: () => twttr.widgets.createMoment(matches[1], document.getElementById(elementId), { width: 400, align: 'left' }) };
        }
        if (/\/timelines\/\d+/.test(pathname)) {
          const matches = pathname.match(/\/timelines\/(\d+)/);
          if (!matches || !matches[1]) {
            return null;
          }
          const elementId = 'twitter-timeline-' + matches[1];
          return { type: 'twitter', elementId: elementId, render: () => twttr.widgets.createGridFromCollection(matches[1], document.getElementById(elementId), { limit: 4, width: 400, align: 'left' }) };
        }
      }
    } // Twitter
    if (network === 'vine') {
      if (type === 'block') {
        let matches = text.match(/src="https:\/\/vine\.co\/v\/([^\/]+)\/embed/);
        if (!matches || !matches[1]) {
          return null;
        }
        const elementId = 'vine-embed-' + matches[1];
        return { type: 'vine', elementId: elementId, render: () => {
          document.getElementById(elementId).innerHTML = '<iframe src="https://vine.co/v/' + matches[1] + '/embed/simple" width="400" height="400" frameborder="0" />';
        } };
      }
      if (type === 'url') {
        const parsedUrl = this.parseUrl(text);
        const pathname = parsedUrl.pathname;
        let matches = text.match(/\/v\/([^\/]+)/);
        if (!matches || !matches[1]) {
          return null;
        }
        const elementId = 'vine-embed-' + matches[1];
        return { type: 'vine', elementId: elementId, render: () => {
          document.getElementById(elementId).innerHTML = '<iframe src="https://vine.co/v/' + matches[1] + '/embed/simple" width="400" height="400" frameborder="0" />';
        } };
      }
    } // Vine

    if (network === 'instagram') {
      if (type === 'block') {
        let matches = text.match(/<a href="https:\/\/instagram.com\/p\/([^\/]+)\/"/);
        if (!matches || !matches[1]) {
          return null;
        }
        const elementId = 'instagram-media-' + matches[1];
        return getInstagramJson(`http://instagr.am/p/${matches[1]}/`)
          .then((data) => {
            const elementId = 'instagram-media' + data.media_id;
            return { type: 'instagram', elementId: elementId, render: () => {
              document.getElementById(elementId).innerHTML = data.html;
              instgrm.Embeds.process();
            } };
          })
      }
      if (type === 'url') {
        const parsedUrl = this.parseUrl(text);
        const pathname = parsedUrl.pathname;
        let matches = text.match(/\/p\/([^\/]+)/);
        if (!matches || !matches[1]) {
          return null;
        }
        const elementId = 'instagram-media-' + matches[1];
        return getInstagramJson(`http://instagr.am/p/${matches[1]}/`)
          .then((data) => {
            const elementId = 'instagram-media' + data.media_id;
            return { type: 'instagram', elementId: elementId, render: () => {
              document.getElementById(elementId).innerHTML = data.html;
              instgrm.Embeds.process();
            } };
          })
      }
    } // Instagram

    if (network === 'youtube') {
      if (type === 'block') {
        let matches = text.match(/src="https\:\/\/www\.youtube\.com\/embed\/([a-z0-9_\-]{11})"/i);
        if (!matches || !matches[1]) {
          return null;
        }
        const elementId = 'youtube-video-' + matches[1];
        return { type: 'twitter', elementId: elementId, render: () => this.renderYoutubePlayer(matches[1], elementId) };
      }
      if (type === 'url') {
        const parsedUrl = this.parseUrl(text);
        let video_id = null;
        if (parsedUrl.hostname.indexOf('youtu.be') > -1) {
          const matches = text.match(/\/\/youtu\.be\/([a-z0-9_\_]{11})/i);
          if (matches && matches.length > 1 && matches[1]) {
            video_id = matches[1];
          }
        } else if (parsedUrl.hostname.indexOf('youtube.com') > -1) {
          const params = Qs.parse(parsedUrl.query);
          video_id = params['v'] || params['video_id'];
        }
        if (!video_id) {
          return null;
        }
        const elementId = 'youtube-video-' + video_id;
        return { type: 'youtube', elementId: elementId, render: () => this.renderYoutubePlayer(video_id, elementId) };
      }
    } // Youtube
  }

  renderYoutubePlayer(video_id, elementId) {
    return new YT.Player(elementId, {
      height: '390',
      width: '640',
      videoId: video_id
    });
  }

  promisedGetCardForText(text, type, network) {
    const response = this.getCardForText(this.state.text, type, network);
    if (response && 'then' in response) {
      return response;
    }
    return Promise.resolve(response);
  }

  onSubmit() {
    if (!this.state.text) {
      return alert('Enter a url first');
    }
    this.setState({ busy: true });
    const type = this.detectTextType(this.state.text);
    const network = this.detectNetwork(this.state.text, type);
    this.promisedGetCardForText(this.state.text, type, network)
      .then((card) => {
        console.log(type, network, card);
        if (!card) {
          this.setState({ busy: false });
          return alert('Failed to parse');
        }

        if (this.findElementIdInCards(card.elementId)) {
          this.setState({ text: '' });
          this.setState({ busy: false });
          return alert('Card already exists');
        }
        this.setState({ text: '', cards: this.state.cards.concat(card), busy: false });
      });
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
