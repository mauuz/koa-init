const Redis = require('ioredis');
const { REDIS_HOST, REDIS_PSW } = require('../../src/config');

// Create Redis client
const redisAuthClient = new Redis({
    host: REDIS_HOST, // Default to localhost if REDIS_HOST is not defined
    port: 6379,                      // Default Redis port
    password: REDIS_PSW,
    connectTimeout: 10000,// Password from config (if needed)
});

module.exports = {
    redisAuthClient
}
