const path = require('path')
const Bundler = require('parcel-bundler')
const express = require('express')
const proxy = require('http-proxy-middleware')
const config = require('../config')

const app = express()

const file = path.resolve(__dirname, '../src/index.html')
const options = {}

const bundler = new Bundler(file, options)

app.use(bundler.middleware())

const proxyTable = config.dev.proxyTable

Object.keys(proxyTable).forEach(key => {
  app.use(key, proxy(proxyTable[key]))
})

const server = app.listen(config.dev.port, function () {
  const port = server.address().port

  console.log('服务器启动成功，请在浏览器访问 http://localhost:%s', port)
})
