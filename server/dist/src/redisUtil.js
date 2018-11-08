"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis = require("redis");
var client = redis.createClient(process.env.REDIS_URL);
exports.redisSet = (key, value) => {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        console.log('redisSet', key, value);
        yield client.set(key, value, () => resolve(true));
    }));
};
exports.redisGet = (key) => {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        console.log('redisGet', key);
        // await client.get(key, (res, s) => resolve(s));
        yield client.get(key, (res, s) => resolve(s !== 'undefined' ? s : undefined));
    }));
};
