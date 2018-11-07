import { redisSet, redisGet } from './src/redisUtil'
import * as express from 'express';
import * as bodyParser from 'body-parser';
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, '../../public')))
  .use(bodyParser.json())
  .get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  })
  .get('/game/get/:id/', async (req, res) => res.json(await redisGet(req.params.id)))
  .post('/game/save/:id/', async (req, res) => res.json(await redisSet(req.params.id, JSON.stringify(req.body))))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
