const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://${process.env.NODE_ENV !== 'production' ? 'localhost' : 'api' }:8080/`,
      changeOrigin: true,
    })
  );
};