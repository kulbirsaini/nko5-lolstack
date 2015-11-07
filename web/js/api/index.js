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


export function GET(url, data = null) {
  if (data) {
    url += '?' + Qs.stringify(data);
  }
  return fetch(url, { credentials: 'Access-Control-Allow-Origin' })
    .then(errorFilter)
    .then((response) => response.json());
}

export function getTweetJson(tweet_url) {
  return GET('https://api.twitter.com/1/statuses/oembed.json', { url: tweet_url });
}
