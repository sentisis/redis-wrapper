'use strict';

const chai = require('chai');
const Promise = require('bluebird');
const redis = require('redis');
const flusher = require('../../lib/flusher');

const expect = chai.expect;

describe('flusher', () => {
  const key = 3;
  let client;
  beforeEach(() => {
    Promise.promisifyAll(redis.RedisClient.prototype);
    Promise.promisifyAll(redis.Multi.prototype);
    client = redis.createClient();
  });
  afterEach(() => {
    client.del(key);
  });

  it('should return error when empty client', () => {
    const e = flusher(null);
    expect(e.message).to.eql('No redis client specified');
  });

  it('should flush objects ', () =>
    client.setAsync('hola', 3)
    .then(() => Promise.resolve(flusher(client)))
    .then((res) => {
      expect(res).to.eql({ flushed: true });
      return client.getAsync('hola');
    })
    .then((res) => {
      expect(res).to.eql(null);
    }));
});
