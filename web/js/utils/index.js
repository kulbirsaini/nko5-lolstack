'use strict';

import { getTwitterCard, renderTwitterWidget } from './twitter';
import { getYoutubeCard, renderYoutubeWidget } from './youtube';
import { getVineCard, renderVineWidget } from './vine';
import { getInstagramCard, renderInstagramWidget } from './instagram';
import { getImgurCard, renderImgurWidget } from './imgur';

import { parseUrl } from './common';

export function getTextType(text) {
  if (
    text.indexOf('<blockquote') > -1 ||
    text.indexOf('<a ') > -1 ||
      text.indexOf('<iframe ') > -1
  ) {
    return 'block';
  }
  if (/^https?:\/\/[^\s]+/.test(text)) {
    return 'url';
  }
  return null;
}

export function getNetworkTypeFromBlock(text) {
  if (
    text.indexOf(' class="twitter-tweet" ') > -1 ||
    text.indexOf(' class="twitter-video" ') > -1 ||
    text.indexOf(' class="twitter-moment" ') > -1 ||
    text.indexOf(' class="twitter-timeline" ') > -1 ||
    text.indexOf(' class="twitter-grid" ') > -1
  ) {
    return 'twitter';
  }
  if (text.indexOf(' class="imgur-embed-pub" ') > -1) {
    return 'imgur';
  }
  if (/\ssrc="https:\/\/vine\.co\/v\//i.test(text)) {
    return 'vine';
  }
  if (text.indexOf(' class="instagram-media" ') > -1) {
    return 'instagram';
  }
  if (/src="https\:\/\/www\.youtube\.com\/embed\//i.test(text)) {
    return 'youtube';
  }
  return null;
}

export function getNetworkTypeFromUrl(text) {
  const parsedUrl = parseUrl(text);
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
  if (parsedUrl.hostname === 'imgur.com') {
    return 'imgur';
  }
  return null;
}

export function renderCard(card, boardId) {
  switch(card.type) {
    case 'twitter':
      return renderTwitterWidget(card.elementId, card.render, boardId);
    case 'youtube':
      return renderYoutubeWidget(card.elementId, card.render, boardId);
    case 'instagram':
      return renderInstagramWidget(card.elementId, card.render, boardId);
    case 'imgur':
      return renderImgurWidget(card.elementId, card.render, boardId);
    case 'vine':
      return renderVineWidget(card.elementId, card.render, boardId);
    default:
      return;
  }
}

export function getCard(text, cards) {
  const VALID_NETWORKS = ['twitter', 'instagram', 'youtube', 'vine', 'imgur'];
  const VALID_TEXT_TYPES = ['block', 'url'];

  const textType = getTextType(text);
  if (!textType || VALID_TEXT_TYPES.indexOf(textType) < 0) {
    return Promise.reject(new Error('Invalid text'));
  }

  let networkType;
  if (textType === 'block') {
    networkType = getNetworkTypeFromBlock(text);
  } else if (textType === 'url') {
    networkType = getNetworkTypeFromUrl(text);
  }
  if (!networkType || VALID_NETWORKS.indexOf(networkType) < 0) {
    return Promise.reject(new Error('Invalid network'));
  }

  let card;
  switch(networkType) {
    case 'twitter':
      card = getTwitterCard(text, textType, cards);
      break;
    case 'instagram':
      card = getInstagramCard(text, textType, cards);
      break;
    case 'vine':
      card = getVineCard(text, textType, cards);
      break;
    case 'youtube':
      card = getYoutubeCard(text, textType, cards);
      break;
    case 'imgur':
      card = getImgurCard(text, textType, cards);
      break;
  }

  console.log(textType, networkType, card);

  if (!card) {
    return Promise.reject('Failed to create card');
  }

  return ('then' in card) ? card : Promise.resolve(card);
}
