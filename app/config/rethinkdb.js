'use strict';

const sharedConfig = {
  tables: {
    users: 'users',
    sessions: 'sessions',
    boards: 'boards',
  },
  indexes: {
    users: [
      { name: 'twitter_id' }
    ],
    boards: [
      { name: 'created_at' },
      { name: 'twitter_id' },
      { name: 'user_id' },
      { name: 'views' },
      { name: 'published' },
      { name: 'published_created_at', fn: function(row) { return [ row('published'), row('created_at') ]; } }
    ]
  }
}

const config = {
  development: {
    hosts: {
      servers: [
        { host: 'localhost', port: 28015 }
      ],
      buffer: 10, //Minimum connections in pool
      max: 50,   //Maximum connections in pool
      discovery: false, // true seems to give issues with reconnecting
      db: 'nko_lolstack_dev'
    }
  },

  production: {
    hosts: {
      servers: [
        {
          host: 'localhost',
          port: 28015,
        }
      ],
      buffer: 10, //Minimum connections in pool
      max: 50,   //Maximum connections in pool
      discovery: false, // true seems to give issues with reconnecting
      db: 'nko_lolstack_prod'
    }
  },

};

function configuration(env) {
  return Object.assign({}, sharedConfig, config[env] || config.development);
}

module.exports = configuration;
