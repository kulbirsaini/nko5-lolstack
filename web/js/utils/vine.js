'use strict';

import { findElementIdInCards, parseUrl } from './common';

// BEGIN - Vine
export function createVineEmbed(vineId, cards) {
  const elementId = 'vine-embed-' + vineId;
  if (findElementIdInCards(elementId, cards)) {
    return Promise.reject(new Error('Card already exists'));
  }
  const render = () => document.getElementById(elementId).innerHTML = `<iframe src="https://vine.co/v/${vineId}/embed/simple" width="400" height="400" frameborder="0" />`;
  return { type: 'vine', elementId: elementId, render };
}

export function getVineCard(text, type, cards) {
  if (type === 'block') {
    const matches = text.match(/src="https:\/\/vine\.co\/v\/([^\/]+)\/embed/);
    console.log(matches);
    if (!matches || !matches[1]) {
      return null;
    }
    return createVineEmbed(matches[1], cards);
  }

  if (type === 'url') {
    const parsedUrl = parseUrl(text);
    const pathname = parsedUrl.pathname;
    const matches = pathname.match(/\/v\/([^\/]+)/);
    if (!matches || !matches[1]) {
      return null;
    }
    return createVineEmbed(matches[1], cards);
  }
}
// END - Vine
