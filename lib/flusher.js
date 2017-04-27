'use strict';

function flusher(client) {
  if (!client) return new Error('No redis client specified');
  try {
    client.FLUSHDB();
    return { flushed: true };
  } catch (e) {
    return { flushed: false };
    return e;
  }
}

module.exports = flusher;
