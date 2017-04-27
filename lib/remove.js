'use strict';

const winston = require('winston');

function remove(client, key) {
  if (!client) return Promise.reject(new Error('No redis client specified'));
  if (!key) return Promise.reject(new Error('No key specified'));

  const command = [];
  command.push(key);

  return client.delAsync(command)
  .then((numDeleted) => {
    const res = { deleted: numDeleted > 0 };
    return res;
  })
  .catch(e => winston.error(e));
}

module.exports = remove;
