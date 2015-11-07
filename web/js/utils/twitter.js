'use strict';

import { findElementIdInCards, parseUrl } from './common';

// BEGIN - Twitter
export function createTwitterTweet(tweetId, cards, options) {
  const elementId = 'twitter-tweet-' + tweetId;
  if (findElementIdInCards(elementId, cards)) {
    return Promise.reject(new Error('Card already exists'));
  }
  const render = () => twttr.widgets.createTweet(tweetId, document.getElementById(elementId), Object.assign({ align: 'left' }, options));
  return { type: 'twitter', elementId: elementId, render };
}

export function createTwitterVideo(videoId, cards, options) {
  const elementId = 'twitter-video-' + videoId;
  if (findElementIdInCards(elementId, cards)) {
    return Promise.reject(new Error('Card already exists'));
  }
  const render = () => twttr.widgets.createVideo(videoId, document.getElementById(elementId), Object.assign({ align: 'left' }, options));
  return { type: 'twitter', elementId: elementId, render };
}

export function createTwitterMoment(momentId, cards, options) {
  const elementId = 'twitter-moment-' + momentId;
  if (findElementIdInCards(elementId, cards)) {
    return Promise.reject(new Error('Card already exists'));
  }
  const render = () => twttr.widgets.createMoment(momentId, document.getElementById(elementId), Object.assign({ width: 400, align: 'left' }, options));
  return { type: 'twitter', elementId: elementId, render };
}

export function createTwitterTimeline(timelineId, cards, options) {
  const elementId = 'twitter-timeline-' + timelineId;
  if (findElementIdInCards(elementId, cards)) {
    return Promise.reject(new Error('Card already exists'));
  }
  const render = () => twttr.widgets.createTimeline(timelineId, document.getElementById(elementId), Object.assign({ tweetLimit: 4, align: 'left' }, options));
  return { type: 'twitter', elementId: elementId, render };
}

export function createTwitterGridFromCollection(collectionId, cards, options) {
  const elementId = 'twitter-timeline-' + collectionId;
  if (findElementIdInCards(elementId, cards)) {
    return Promise.reject(new Error('Card already exists'));
  }
  const render = () => twttr.widgets.createGridFromCollection(collectionId, document.getElementById(elementId), Object.assign({ limit: 4, width: 400, align: 'left' }, options));
  return { type: 'twitter', elementId: elementId, render };
}

export function getTwitterCard(text, type, cards) {
  if (type === 'block') {
    if (text.indexOf(' class="twitter-tweet" ') > -1) {
      let matches = text.match(/<a href="https:\/\/twitter.com\/[^\/]+\/status\/(\d+)">/);
      if (!matches || !matches[1]) {
        return null;
      }
      return createTwitterTweet(matches[1], cards);
    }
    if (text.indexOf(' class="twitter-video" ') > -1) {
      let matches = text.match(/<a href="https:\/\/twitter.com\/[^\/]+\/status\/(\d+)">/);
      if (!matches || !matches[1]) {
        return null;
      }
      return createTwitterVideo(matches[1], cards);
    }
    if (text.indexOf(' class="twitter-moment" ') > -1) {
      let matches = text.match(/href="https:\/\/twitter.com\/i\/moments\/(\d+)">/);
      if (!matches || !matches[1]) {
        return null;
      }
      return createTwitterMoment(matches[1], cards);
    }
    if (text.indexOf(' class="twitter-timeline" ') > -1) {
      let matches = text.match(/\sdata-widget-id="(\d+)"/);
      if (!matches || !matches[1]) {
        return null;
      }
      return createTwitterTimeline(matches[1], cards);
    }
    if (text.indexOf(' class="twitter-grid" ') > -1) {
      let matches = text.match(/href="https:\/\/twitter.com\/[^\/]+\/timelines\/(\d+)">/);
      if (!matches || !matches[1]) {
        return null;
      }
      return createTwitterGridFromCollection(matches[1], cards);
    }
  }

  if (type === 'url') {
    const parsedUrl = parseUrl(text);
    const pathname = parsedUrl.pathname;

    if (/\/status\//.test(pathname)) {
      const matches = pathname.match(/\/status\/(\d+)/);
      if (!matches || !matches[1]) {
        return null;
      }
      return createTwitterTweet(matches[1], cards);
    }
    if (/\/i\/moments\/\d+/.test(pathname)) {
      const matches = pathname.match(/\/i\/moments\/(\d+)/);
      if (!matches || !matches[1]) {
        return null;
      }
      return createTwitterMoment(matches[1], cards);
    }
    if (/\/timelines\/\d+/.test(pathname)) {
      const matches = pathname.match(/\/timelines\/(\d+)/);
      if (!matches || !matches[1]) {
        return null;
      }
      return createTwitterGridFromCollection(matches[1], cards);
    }
  }
}
// END - Twitter
