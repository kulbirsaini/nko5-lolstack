'use strict';

const util = require('util');

function createApiError(name) {
  let func = function(message, statusCode, error, extra) {
    Error.captureStackTrace(this, func);
    this.name = name;
    this.statusCode = statusCode;
    this.message = message;
    this._error = error; // Original error
    this.extra = extra;
    this.toJSON = function() {
      return {
        name    : this.name,
        message : this.message,
        code    : this.statusCode
      };
    };
  };

  util.inherits(func, Error);
  return func;
}

function createError(name) {
  let func = function(message, error, extra) {
    Error.captureStackTrace(this, func);
    this.name = name;
    this.message = message;
    this.extra = extra;
    this._error = error; // Original error
    this.toJSON = function() {
      return {
        name    : this.name,
        message : this.message,
      };
    };
  };

  util.inherits(func, Error);
  return func;
}

module.exports = {
  DbUpdateError              : createError('DatabaseUpdateError'),
  GenericApiError            : createApiError('GenericApiError'),
  UnAuthenticatedApiError    : createApiError('UnAuthenticatedApiError'),
  MissingParameterApiError   : createApiError('MissingParameterApiError'),
};
