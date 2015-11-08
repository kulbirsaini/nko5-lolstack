'use strict';

import fetch from 'isomorphic-fetch';
import Qs from 'qs';

function errorFilter(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errorJson = response.json();
  let error = new Error(errorJson.message);
  error.response = response;
  throw error;
}

export function POST(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    credentials: 'same-origin'
  })
  .then(errorFilter)
  .then((response) => response.json());
}

export function PUT(url, data) {
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    credentials: 'same-origin'
  })
  .then(errorFilter)
  .then((response) => response.json());
}

export function DELETE(url) {
  return fetch(url, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
  .then(errorFilter)
  .then((response) => response.json());
}

export function GET(url, data = null) {
  if (data) {
    url += '?' + Qs.stringify(data);
  }
  return fetch(url, { credentials: 'same-origin' })
    .then(errorFilter)
    .then((response) => response.json());
}

export function corsGET(url, data = null) {
  const callback = `callback_${Date.now()}`;

  return new Promise(function(resolve) {
    window[callback] = function (data) {
      delete window[callback];
      resolve(data);
    };

    url += '?' + Qs.stringify(Object.assign({}, data || {}, { callback: callback }));
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.head.appendChild(script);
  });
}

export function getTweetJson(tweet_url) {
  return GET('https://api.twitter.com/1/statuses/oembed.json', { url: tweet_url });
}

export function getInstagramJson(url) {
  return corsGET('http://api.instagram.com/oembed', { url, omitscript: true });
}

export function getBoard(boardId) {
  return GET(`/api/boards/${boardId}`);
}

export function getBoards(cursor = -1, count = 10, order = 'desc') {
  return GET('/api/boards', { cursor, count, order });
}

export function createBoard(params) {
  return POST('/api/boards', params);
}

export function updateBoard(boardId, params) {
  return PUT(`/api/boards/${boardId}`, params)
}

export function deleteBoard(boardId) {
  return DELETE(`/api/boards/${boardId}`);
}
