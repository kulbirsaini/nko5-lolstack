'use strict';

import Qs from 'qs';

export function findElementIdInCards(elementId, cards) {
  return cards.filter((card) => card.elementId === elementId).length !== 0;
}

export function parseUrl(url) {
  const parser = document.createElement('a');
  parser.href = url;
  return {
    hostname: parser.hostname,
    pathname: parser.pathname,
    query: Qs.parse((parser.search || '').replace(/^\?/, ''))
  };
}
