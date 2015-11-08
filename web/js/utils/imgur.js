'use strict';

import { findElementIdInCards, parseUrl } from './common';

export function renderImgurWidget(elementId, params) {
  document.getElementById(elementId).innerHTML = `<blockquote class="imgur-embed-pub" lang="en" data-id="${params.id}"></blockquote>`;
  imgurEmbed.createIframe();
}

export function createImgurEmbed(imgId, cards) {
  const elementId = 'imgur-embed-' + imgId;
  if (findElementIdInCards(elementId, cards)) {
    return Promise.reject(new Error('Card already exists'));
  }
  return { type: 'imgur', elementId, render: { id: imgId } };
}

export function getImgurCard(text, type, cards) {
  if (type === 'block') {
    const matches = text.match(/\sdata-id="([a-z0-9_\-\/]+)"/i);
    if (!matches || !matches[1]) {
      return null;
    }
    return createImgurEmbed(matches[1], cards);
  }

  if (type === 'url') {
    const parsedUrl = parseUrl(text);
    const pathname = parsedUrl.pathname;

    let matches = pathname.match(/\/a\/([a-z0-9_\-]+)$/i);
    if (matches && matches.length > 1 && matches[1]) {
      return createImgurEmbed('a/' + matches[1], cards);
    }

    matches = pathname.match(/\/([a-z0-9_\-]+)$/i);
    if (matches && matches.length > 1 && matches[1]) {
      return createImgurEmbed(matches[1], cards);
    }
    return null;
  }
}
