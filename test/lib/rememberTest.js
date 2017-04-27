'use strict';

const chai = require('chai');
const Promise = require('bluebird');
const redis = require('redis');
const remember = require('../../lib/remember');

const expect = chai.expect;

describe('remember', () => {
  const key = 3;
  const key2 = 4;
  const key3 = 'hola';
  let client;
  beforeEach(() => {
    Promise.promisifyAll(redis.RedisClient.prototype);
    Promise.promisifyAll(redis.Multi.prototype);
    client = redis.createClient();
  });
  afterEach(() => {
    client.del(key, key2, key3);
  });

  it('should return error when empty client', () =>
    remember(null, '{ "key": 1, "ttl": "a" }')
    .catch((e) => {
      expect(e.message).to.eql('No redis client specified');
    }));

  it('should return error when no data provided', () =>
    remember(client, '')
    .catch((e) => {
      expect(e.message).to.eql('No data provided');
    }));

  it('should return error when not valid JSON provided', () =>
    remember(client, `{ key: ${key}  }`)
    .catch((e) => {
      expect(e.message).to.eql('Not valid JSON');
    }));

  it('should return error when not key provided', () =>
    remember(client, '{ "ttl": 10  }')
    .catch((e) => {
      expect(e.message).to.eql('No key specified');
    }));

  it('should return error when not ttl provided', () =>
    remember(client, `{ "key": ${key} }`)
    .catch((e) => {
      expect(e.message).to.eql('No ttl specified');
    }));

  it('should save error when not ttl provided', () =>
    remember(client, `{ "key": ${key} }`)
    .catch((e) => {
      expect(e.message).to.eql('No ttl specified');
    }));

  it('should return {new: true} when new value', () => {
    const cmd = {
      key,
      value: 8,
      ttl: 10,
    };
    return remember(client, JSON.stringify(cmd))
    .then((res) => {
      expect(res).to.eql({ new: true });
    });
  });
  it('should return {new: false} when NOT new value', () => {
    const cmd = {
      key,
      value: 8,
      ttl: 10,
    };
    return remember(client, JSON.stringify(cmd))
    .then(() => remember(client, JSON.stringify(cmd)))
    .then((res) => {
      expect(res).to.eql({ new: false });
    });
  });
});
