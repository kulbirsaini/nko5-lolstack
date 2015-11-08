'use strict';

import { findElementIdInCards, parseUrl } from './common';

// BEGIN - Twitter
// params = { type, id, styleOptions }
export function renderTwitterWidget(elementId, params) {
  switch(params.type) {
    case 'createTweet':
      return twttr.widgets.createTweet(params.id, document.getElementById(elementId), params.options);
    case 'createVideo':
      return twttr.widgets.createVideo(params.id, document.getElementById(elementId), params.options);
    case 'createMoment':
      return twttr.widgets.createMoment(params.id, document.getElementById(elementId), params.options);
    case 'createTimeline':
      return twttr.widgets.createTimeline(params.id, document.getElementById(elementId), params.options);
    case 'createGridFromCollection':
      return twttr.widgets.createGridFromCollection(params.id, document.getElementById(elementId), params.options);
  }
}

export function createTwitterTweet(tweetId, cards, opts) {
  const elementId = 'twitter-tweet-' + tweetId;
  if (findElementIdInCards(elementId, cards)) {
    return Promise.reject(new Error('Card already exists'));
  }
  return { type: 'twitter', elementId: elementId, render: { type: 'createTweet', id: tweetId, options: Object.assign({ align: 'left' }, opts) } };
}

export function createTwitterVideo(videoId, cards, options) {
  const elementId = 'twitter-video-' + videoId;
  if (findElementIdInCards(elementId, cards)) {
    return Promise.reject(new Error('Card already exists'));
  }
  return { type: 'twitter', elementId: elementId, render: { type: 'createVideo', id: videoId, options: Object.assign({ align: 'left' }, options) } };
}

export function createTwitterMoment(momentId, cards, options) {
  const elementId = 'twitter-moment-' + momentId;
  if (findElementIdInCards(elementId, cards)) {
    return Promise.reject(new Error('Card already exists'));
  }
  return { type: 'twitter', elementId: elementId, render: { type: 'createMoment', id: momentId, options: Object.assign({ width: 400, align: 'left' }, options) } };
}

export function createTwitterTimeline(timelineId, cards, options) {
  const elementId = 'twitter-timeline-' + timelineId;
  if (findElementIdInCards(elementId, cards)) {
    return Promise.reject(new Error('Card already exists'));
  }
  return { type: 'twitter', elementId: elementId, render: { type: 'createTimeline', id: timelineId, options: Object.assign({ tweetLimit: 4, align: 'left' }, options) } };
}

export function createTwitterGridFromCollection(collectionId, cards, opts) {
  const elementId = 'twitter-timeline-' + collectionId;
  if (findElementIdInCards(elementId, cards)) {
    return Promise.reject(new Error('Card already exists'));
  }
  return { type: 'twitter', elementId: elementId, render: { type: 'createGridFromCollection', id: collectionId, options: Object.assign({ limit: 4, width: 400, align: 'left' }, opts) } };
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
