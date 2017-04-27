'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

function remember(client, data) {
  if (!client) return Promise.reject(new Error('No redis client specified'));
  if (_.isEmpty(data)) return Promise.reject(new Error('No data provided'));
  let parsed = null;
  try {
    parsed = JSON.parse(data);
  } catch (e) {
    return Promise.reject(new Error('Not valid JSON'));
  }

  const key = _.get(parsed, 'key');
  const ttl = _.get(parsed, 'ttl');
  if (!key) return Promise.reject(new Error('No key specified'));
  if (!ttl) return Promise.reject(new Error('No ttl specified'));

  const value = _.get(parsed, 'value') || true;
  const setCommand = [];
  setCommand.push(key);
  setCommand.push(value);
  // No TTL
  if (ttl > 0) {
    setCommand.push('EX');
    setCommand.push(ttl);
  }

  // Initiate a transaction: MULTI, GET, SET, EXEC
  // Return a new: false ONLY if the GET does return anything
  // different than null. Otherwise, the key is new.
  return client
  .multi()
  .get(key)
  .set(setCommand)
  .execAsync()
  .then((arr) => {
    const isNew = arr[0] == null;
    return { new: isNew };
  });
}

module.exports = remember;
