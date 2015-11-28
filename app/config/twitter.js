'use strict';

const config = {
  development: {
    consumerKey:     'TWITTER_CONSUMER_KEY',
    consumerSecret:  'TWITTER_CONSUDER_SECRET',
    callbackURL:     'http://127.0.0.1:8000/auth/twitter/callback'
  },
  production: {
    consumerKey:     'TWITTER_CONSUMER_KEY',
    consumerSecret:  'TWITTER_CONSUDER_SECRET',
    callbackURL:     'http://lolstack.2015.nodeknockout.com/auth/twitter/callback'
  }
};

function configuration(env) {
  return config[env] || config.development;
}

module.exports = configuration;
