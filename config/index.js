module.exports = {
  dev: {
    port: 8080,
    proxyTable: {
      '/mockServer': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/mockServer': ''
        },
        logLevel: 'debug'
      }
    }
  }
}
