'use strict';

const _ = require('lodash');
const url = require('url');
const qs = require('querystring');

function getter(client, key) {
  if (!client) return Promise.reject(new Error('No redis client specified'));
  if (!key) return Promise.reject(new Error('No key specified'));

  const command = [];
  command.push(key);


  return client.getAsync(command)
  .then((obj) => {
    const res = { value: '' };
    if (!_.isEmpty(obj)) {
      res.value = `${obj}`;
    }
    return res;
  });
}

module.exports = getter;
