"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redisUtil_1 = require("./redisUtil");
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/game/get', (req, res) => res.send(redisUtil_1.redisGet(req.body.id)))
    .get('/game/save', (req, res) => redisUtil_1.parseJson(req.body).then(json => res.send(redisUtil_1.redisSet(json.id, json.value))))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
