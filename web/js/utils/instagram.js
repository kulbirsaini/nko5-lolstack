'use strict';

import { findElementIdInCards, parseUrl } from './common';
import { getInstagramJson } from '../api';

// BEGIN - Instagram
export function renderInstagramWidget(elementId, params) {
  return document.getElementById(elementId).innerHTML = params.html;
}

export function createInstagramEmbed(mediaId, cards) {
  const elementId = 'instagram-media-' + mediaId;
  if (findElementIdInCards(elementId, cards)) {
    return Promise.reject(new Error('Card already exists'));
  }

  return getInstagramJson(`http://instagr.am/p/${mediaId}/`)
    .then((data) => {
      const elementId = 'instagram-media-' + data.media_id;
      if (findElementIdInCards(elementId, cards)) {
        return Promise.reject(new Error('Card already exists'));
      }
      const render = () => document.getElementById(elementId).innerHTML = data.html.replace(/\0/g, '');

      return { type: 'instagram', elementId: elementId, render: { id: data.media_id, html: data.html } };
    });
}

export function getInstagramCard(text, type, cards) {
  if (type === 'block') {
    let matches = text.match(/<a href="https:\/\/instagram.com\/p\/([^\/]+)\/"/);
    if (!matches || !matches[1]) {
      return null;
    }
    return createInstagramEmbed(matches[1], cards);
  }
  if (type === 'url') {
    const parsedUrl = parseUrl(text);
    const pathname = parsedUrl.pathname;
    let matches = pathname.match(/\/p\/([^\/]+)/);
    if (!matches || !matches[1]) {
      return null;
    }
    return createInstagramEmbed(matches[1], cards);
  }
}
// END - Instagram
