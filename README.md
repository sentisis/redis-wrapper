# Redis wrapper

Redis wrapper using *bluebird* promises. It is extendable by modules.

## Requirements
Redis server should be running and a client should be already created.

## Usage
```
npm i @sentisis/redis-wrapper
```


```javascript
const redis = require('redis');
const Promise = require('bluebird');

const redisWrapper = require('@sentisis/redis-wrapper');
// enable promises for redis https://github.com/NodeRedis/node_redis#promises
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const client = redis.createClient();
const key = 'a';
const value = 'b';
client.set(key, value);

redisWrapper.getter(client, key)
.then((res) => {
  // res = { value: 'b'}
});
```
---
## Current Modules

All Module operations are atomic, using [transactions](https://redis.io/topics/transactions) when needed.

### [Keys] COUNTER

Increments a given key, for a INCR_BY parameter (or 1 if not defined)

Params:

* client: created redis client.
* data: `{'key': <key>, 'incr_by': <value>}, 'ttl': <ttl>}`

Where:

* `key`: must be defined
* `ttl`: if not supplied, the key is persisted forever
* `incr_by` [optional]: If it is not defined, it defaults to 1 (so it sums 1 to the current value, or puts 1 if the key does not exist)

Sample response:

`{'new_value': <new_value>}`

Where:

* `new_value`: is the actual value AFTER being updated

### [Keys] GETTER

Gets the value of a given key.

Params:

* client: created redis client.
* key

Where:

* `key`: must be defined

Response:

`{'value':<value>}`

Where:

* `value` is an empty string (`''` if the key does not exist) or the value

### [Keys] REMEMBER

Remembers a given key, for a specified ttl and value into redis

Params:

* client: created redis client.
* data: `{'key': <key>, 'ttl': <ttl>, 'value': <value>}`

Where:

* `ttl` [optional]: Time to leave (expiration from now in seconds). If the value is not given, `0` or `-1`, it does persist forever.
* `value` [optional]: Value for the key. If not given, it is set to true.

Response

`{'new': <true|false>}`

That indicates if the just inserted key is new to the system or not.

### [Keys] REMOVE

Deletes a given key.

Params:

* client: created redis client.
* key

Where:

* `key`: must be defined

Response:

`{'deleted':<true|false>}`

Where:

* `deleted` is `true` if the key has been deleted, `false` otherwise (the key did not exist).


### HEALTHCHECKER

Checks if the system is running correctly, or not.

Params:

* client: created redis client.

Response:

`{'status': 'ok'}`

### FLUSHER

Flush the DB.

Params:

* client: created redis client.

Where:

* `client`: must be a redis client.

Response:

`{'flushed': <true|false>}`
