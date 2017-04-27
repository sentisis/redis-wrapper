'use strict';

const chai = require('chai');
const redis = require('redis');
const Promise = require('bluebird');
const healthchecker = require('../../lib/healthchecker');

const expect = chai.expect;

describe('healthChecker', () => {
  let client;
  beforeEach(() => {
    Promise.promisifyAll(redis.RedisClient.prototype);
    Promise.promisifyAll(redis.Multi.prototype);
    client = redis.createClient();
  });

  it('should return error when empty client', () =>
    healthchecker(null)
    .catch((e) => {
      expect(e.message).to.eql('No redis client specified');
    }));

  it('should cb with 200 on ping answer', () =>
    healthchecker(client)
    .then((data) => {
      expect(data).to.eql({ status: 'ok' });
    }));
});
