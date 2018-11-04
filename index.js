define("src/app/redis", ["require", "exports", "src/app/redis"], function (require, exports, redis) {
    "use strict";
    exports.__esModule = true;
    var client = redis.createClient(process.env.REDIS_URL);
    exports.redisSet = function (key, value) {
        return new Promise(function (resolve) {
            client.set(key, value, function () { return resolve(true); });
        });
    };
    exports.redisGet = function (key) {
        return new Promise(function (resolve) {
            client.get(key, function (res, s) { return resolve(s); });
        });
    };
    exports.parseJson = function (body) {
        return new Promise(function (resolve) {
            resolve(JSON.parse(body));
        });
    };
});
define("index", ["require", "exports", "src/app/redis"], function (require, exports, redis_1) {
    "use strict";
    exports.__esModule = true;
    var express = require('express');
    var path = require('path');
    var PORT = process.env.PORT || 5000;
    express()
        .use(express.static(path.join(__dirname, 'public')))
        .set('views', path.join(__dirname, 'views'))
        .set('view engine', 'ejs')
        .get('/game/get', function (req, res) { return res.send(redis_1.redisGet(req.body.id)); })
        .get('/game/save', function (req, res) { return redis_1.parseJson(req.body).then(function (json) { return res.send(redis_1.redisSet(json.id, json.value)); }); })
        .listen(PORT, function () { return console.log("Listening on " + PORT); });
});
