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
const redisUtil_1 = require("./src/redisUtil");
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const PORT = process.env.PORT || 5000;
express()
    .use(bodyParser.json())
    .use(express.static(__dirname + '/../../public'))
    .get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})
    .use('/:id/', express.static(__dirname + '/../../public'))
    .get('/:id/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})
    .get('/api/game/get/:id/', (req, res) => __awaiter(this, void 0, void 0, function* () { return res.json(yield redisUtil_1.redisGet(req.params.id)); }))
    .post('/api/game/save/:id/', (req, res) => __awaiter(this, void 0, void 0, function* () { return res.json(yield redisUtil_1.redisSet(req.params.id, JSON.stringify(req.body))); }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
