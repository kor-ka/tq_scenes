import { redisSet, redisGet, parseJson } from './src/redisUtil'
import * as express from 'express';
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, '../../public')))
  .get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  })
  .get('/game/get/:id/', (req, res) => res.send(redisGet(req.params.id)))
  .post('/game/save/:id/', (req, res) => res.send(redisSet(req.params.id, JSON.stringify(req.body))))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
