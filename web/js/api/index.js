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
  return fetch(url, { headers: { 'Access-Control-Allow-Origin': '*' } })
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
