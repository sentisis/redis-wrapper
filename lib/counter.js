'use strict';

const _ = require('lodash');

function counter(client, data) {
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
  const incrBy = _.get(parsed, 'incr_by', 1);
  if (!key) return Promise.reject(new Error('No key specified'));

  const commandIncr = [];
  commandIncr.push(key);
  commandIncr.push(incrBy);

  const transaction = client.multi();
  transaction.incrby(commandIncr);

  if (ttl) {
    transaction.expire(key, ttl);
  } else {
    transaction.persist(key);
  }

  return transaction.execAsync()
  .then((obj) => {
    const res = { new_value: obj[0] };
    return res;
  });
}

module.exports = counter;
