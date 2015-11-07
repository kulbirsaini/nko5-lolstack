'use strict';


function formatError(error) {
  if (!error) {
    return '';
  }

  error._error = error._error || {};

  let formattedError = '';

  if (error._error.name || error._error.message) {
    formattedError += `${error._error.name || 'Error'}: ${error._error.message}\n`;
  }

  formattedError += `${error.name || 'Error'}: ${error.message}`;

  if (error.statusCode) {
    formattedError += `, Status Code: ${error.statusCode}`;
  }
  formattedError += `\n${error._error.stack || error.stack}`;

  return formattedError;
}



module.exports = {
  formatError,
};
