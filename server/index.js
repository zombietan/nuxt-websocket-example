const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const dotenv = require('dotenv');
const Twitter = require('twitter');

dotenv.config()

const twitter = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

var trendsdb = []
// 30秒間隔でブロードキャスト
async function broadcastTrends(io) {
  try {
    const trends = await twitter.get('trends/place.json', {id: 23424856});
    console.log(JSON.stringify(trends[0].trends, null, "\t")); 
    trendsdb = trends[0].trends
    io.emit('trends', trendsdb)
  } catch (error) {
    console.log(error);
  }
  setTimeout(await broadcastTrends, 30000, io);
}

function socketStart(server) {
  const io = require('socket.io').listen(server)
  broadcastTrends(io)
  io.on('connection', socket => {
    socket.on('init', fn => {
      fn(trendsdb)
    })
  })
}

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  let server = app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })

  socketStart(server)
}
start()
