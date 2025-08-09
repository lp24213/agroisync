const serverless = require('serverless-http');
const server = require('./server');

// server.js exports both the HTTP server and the Express app.
// We need the Express app to wrap with serverless-http.
const app = server.app || server.default || server;

module.exports.handler = serverless(app);


