'use strict';

const chai = require('chai');
const Promise = require('bluebird');
const redis = require('redis');
const getter = require('../../lib/getter');

const expect = chai.expect;

describe('getter', () => {
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
      getter(null, key)
      .catch((e) => {
        expect(e.message).to.eql('No redis client specified');
      }));

  it('should return an error on null key', () =>
      getter(client, null)
      .catch((e) => {
        expect(e.message).to.eql('No key specified');
      }));

  it('should return an object with the right value', () =>
    getter(client, key)
    .then((data) => {
      expect(data).to.eql({ value: `${value}` });
    }));

  it('should return an object with NO value', () => {
    client.del(key);
    return getter(client, key)
    .then((data) => {
      expect(data).to.eql({ value: '' });
    });
  });
});
