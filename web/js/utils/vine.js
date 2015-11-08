'use strict';

import { findElementIdInCards, parseUrl } from './common';

// BEGIN - Vine
export function renderVineWidget(elementId, params, boardId) {
  if (boardId) {
    elementId += '-' + boardId;
  }
  return document.getElementById(elementId).innerHTML = `<iframe src="https://vine.co/v/${params.id}/embed/simple" width="400" height="400" frameborder="0" />`;
}

export function createVineEmbed(vineId, cards) {
  const elementId = 'vine-embed-' + vineId;
  if (findElementIdInCards(elementId, cards)) {
    return Promise.reject(new Error('Card already exists'));
  }
  return { type: 'vine', elementId: elementId, render: { id: vineId } };
}

export function getVineCard(text, type, cards) {
  if (type === 'block') {
    const matches = text.match(/src="https:\/\/vine\.co\/v\/([^\/]+)\/embed/);
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
