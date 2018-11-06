"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis = require("redis");
var client = redis.createClient(process.env.REDIS_URL);
exports.redisSet = (key, value) => {
    return new Promise(resolve => {
        client.set(key, value, () => resolve(true));
    });
};
exports.redisGet = (key) => {
    return new Promise(resolve => {
        client.get(key, (res, s) => resolve(s));
    });
};
exports.parseJson = (body) => {
    return new Promise(resolve => {
        resolve(JSON.parse(body));
    });
};
