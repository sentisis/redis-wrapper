'use strict';

const chai = require('chai');
const redis = require('redis');
const Promise = require('bluebird');
const counter = require('../../lib/counter');

const expect = chai.expect;

describe('counter', () => {
  const key = 3;
  const value = 4;
  const ttl = 10;
  const incrBy = 4;
  let client;
  beforeEach(() => {
    Promise.promisifyAll(redis.RedisClient.prototype);
    Promise.promisifyAll(redis.Multi.prototype);
    client = redis.createClient();
  });

  afterEach(() => {
    client.del(key);
  });

  it('should return error when empty client', () =>
    counter(null, '{ "key": 1, "ttl": "a" }')
    .catch((e) => {
      expect(e.message).to.eql('No redis client specified');
    }));

  it('should return error when no data provided', () =>
    counter(client, '')
    .catch((e) => {
      expect(e.message).to.eql('No data provided');
    }));

  it('should return error when not valid JSON provided', () =>
    counter(client, `{ key: ${key}  }`)
    .catch((e) => {
      expect(e.message).to.eql('Not valid JSON');
    }));

  it('should return error when not key provided', () =>
    counter(client, '{ "ttl": 10  }')
    .catch((e) => {
      expect(e.message).to.eql('No key specified');
    }));

  it('should return error when not ttl provided', () =>
    counter(client, `{ "key": ${key} }`)
    .catch((e) => {
      expect(e.message).to.eql('No ttl specified');
    }));

  it('should work with complete data', () => {
    const data = {
      key,
      value,
      ttl,
      incr_by: incrBy,
    };

    return counter(client, JSON.stringify(data))
    .then((res) => {
      expect(res).to.eql({ new_value: 4 });
    });
  });

  it('should work without incrBy', () => {
    const data = {
      key,
      value,
      ttl,
    };

    return counter(client, JSON.stringify(data))
    .then((res) => {
      expect(res).to.eql({ new_value: 1 });
    });
  });

  it('should work withour ttl and incrBy', () => {
    const data = {
      key,
      value,
    };

    return counter(client, JSON.stringify(data))
    .then((res) => {
      expect(res).to.eql({ new_value: 1 });
    });
  });

  it('should increase with more than 1 transaction', () => {
    const data = {
      key,
      value,
      ttl,
      incr_by: incrBy,
    };

    return counter(client, JSON.stringify(data))
    .then((res) => {
      expect(res).to.eql({ new_value: 4 });
      return counter(client, JSON.stringify(data));
    })
    .then((nextResult) => {
      expect(nextResult).to.eql({ new_value: 8 });
    });
  });
});
