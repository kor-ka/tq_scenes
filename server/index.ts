import { redisSet, redisGet } from './src/redisUtil'
import * as express from 'express';
import * as bodyParser from 'body-parser';
const path = require('path')
const PORT = process.env.PORT || 5000

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

  .get('/api/game/get/:id/', async (req, res) => res.json(await redisGet(req.params.id)))
  .post('/api/game/save/:id/', async (req, res) => res.json(await redisSet(req.params.id, JSON.stringify(req.body))))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
