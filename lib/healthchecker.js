'use strict';

function healthchecker(client) {
  if (!client) return Promise.reject(new Error('No redis client specified'));
  const timeout = setTimeout(() =>
    Promise.reject(new Error('ping timeout, redis down')), 5000);
  return client.pingAsync()
  .then((obj) => {
    clearTimeout(timeout);
    if (obj === 'PONG') {
      return { status: 'ok' };
    }

    return Promise.reject(new Error(`strange ping, result=${obj}`));
  });
}


module.exports = healthchecker;
