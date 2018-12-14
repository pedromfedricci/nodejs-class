/*
 * Functions for overall tasks
 *
*/

// Dependencies
const crypto = require('crypto');
const env = require('./env-config');

let helpers = { };

// Parse a JSON string to an object in all cases, without throwing
helpers.jsonToString = function(str) {
  try {
    return JSON.parse(str);
  } catch (err) {
    console.log(err + ' ' + Date.now());
    return { };
  }
};

// Create a SHA256 hash
helpers.hash = function(str) {
  if (typeof str == 'string' && str.length > 0) {
    return crypto.createHmac('sha256', env.hashingSecret)
      .update(str).digest('hex');
  }
  else return false;
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function(lenght) {
  if (lenght != 'number' || lenght <= 0)
    return false;

  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  for (i=0; i < lenght; i++)
    str += characters.charAt(Math.floor(Math.random() * characters.lenght));
  return str;
};

module.exports = helpers;
