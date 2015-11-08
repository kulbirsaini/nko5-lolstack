'use strict';

import { findElementIdInCards, parseUrl } from './common';

// BEGIN - Youtube
export function renderYoutubeWidget(elementId, params) {
  return createYoutubePlayer(params.id, params.list, elementId);
}

export function createYoutubePlayer(video_id, list, elementId) {
  let player;
  if (list && list.index && +list.index > 0) {
    list.index = +list.index - 1;
  }

  let params = {
    height: '390',
    width: '400',
    videoId: video_id,
    events: {
      'onReady': function() {
        if (!player || !list || !list.list_id) {
          return;
        }
        player.cuePlaylist({ list: list.list_id, listType: 'playlist', index: list.index });
      }
    }
  };
  player = new YT.Player(elementId, params);
  return player;
}

export function createYoutubeEmbed(video_id, list, cards) {
  if (!video_id && !list.list_id) {
    return null;
  }

  const elementId = 'youtube-video-' + (video_id || list.list_id);
  if (findElementIdInCards(elementId, cards)) {
    return Promise.reject(new Error('Card already exists'));
  }

  return { type: 'youtube', elementId, render: { id: video_id, list } };
}

export function getYoutubeCard(text, type, cards) {
  if (type === 'block') {
    const matches = text.match(/\ssrc="([^"]+)"\s/);
    if (!matches || !matches[1]) {
      return null;
    }

    const parsedUrl = parseUrl(matches[1]);
    const pathname = parsedUrl.pathname;

    let video_id;
    let list = { list_id: parsedUrl.query.list, index: parsedUrl.query.index };

    if (/\/embed\/videoseries/.test(pathname)) {
      video_id = null;
    } else {
      const vid_matches = pathname.match(/\embed\/([a-z0-9_\-]{11})/i);
      if (vid_matches && vid_matches.length > 1 && vid_matches[1]) {
        video_id = vid_matches[1];
      }
    }
    return createYoutubeEmbed(video_id, list, cards);
  }

  if (type === 'url') {
    const parsedUrl = parseUrl(text);
    let video_id = null;
    let list = { list_id: parsedUrl.query.list, index: parsedUrl.query.index }
    if (parsedUrl.hostname.indexOf('youtu.be') > -1) {
      const matches = text.match(/\/\/youtu\.be\/([a-z0-9_\_]{11})/i);
      if (matches && matches.length > 1 && matches[1]) {
        video_id = matches[1];
      }
    } else if (parsedUrl.hostname.indexOf('youtube.com') > -1) {
      video_id = parsedUrl.query.v || parsedUrl.query.video_id;
    }
    if (!video_id && !list.list_id) {
      return null;
    }
    return createYoutubeEmbed(video_id, list, cards);
  }
}
// END - Youtube
