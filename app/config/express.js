'use strict';

const config = {
  development: {
    host: '127.0.0.1',
    port: 8000
  },
  production: {
    host: '127.0.0.1',
    port: 8080
  }
};

function configuration(env) {
  return config[env] || config.development;
}

module.exports = configuration;