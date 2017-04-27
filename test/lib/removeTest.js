'use strict';

const chai = require('chai');
const Promise = require('bluebird');
const redis = require('redis');
const remove = require('../../lib/remove');

const expect = chai.expect;

describe('remove', () => {
  const key = 3;
  const value = 4;
  let client;
  beforeEach(() => {
    Promise.promisifyAll(redis.RedisClient.prototype);
    Promise.promisifyAll(redis.Multi.prototype);
    client = redis.createClient();
    client.set(key, value);
  });
  afterEach(() => {
    client.del(key);
  });

  it('should return with error when NO client', () =>
    remove(null, key)
    .catch((e) => {
      expect(e.message).to.eql('No redis client specified');
    }));

  it('should return an error on null key', () =>
    remove(client, null)
    .catch((e) => {
      expect(e.message).to.eql('No key specified');
    }));

  it('should return an error when empty key', () =>
    remove(client, '')
    .catch((e) => {
      expect(e.message).to.eql('No key specified');
    }));

  it('should work with key', () =>
    remove(client, key)
    .then((res) => {
      expect(res).to.eql({ deleted: true });
    }));
});
