import { redisSet, redisGet, parseJson } from './src/server/redis'
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/game/get', (req, res) => res.send(redisGet(req.body.id)))
  .get('/game/save', (req, res) => parseJson(req.body).then(json => res.send(redisSet(json.id, json.value))))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
