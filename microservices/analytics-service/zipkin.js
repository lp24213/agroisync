const {
  Tracer,
  BatchRecorder,
  jsonEncoder: { JSON_V2 },
} = require('zipkin');
const { HttpLogger } = require('zipkin-transport-http');
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;

const recorder = new BatchRecorder({
  logger: new HttpLogger({
    endpoint: process.env.ZIPKIN_ENDPOINT || 'http://localhost:9411/api/v2/spans',
    jsonEncoder: JSON_V2,
  }),
});

const tracer = new Tracer({
  ctxImpl: new (require('zipkin-context-cls').CLSContext)('zipkin'),
  recorder,
  localServiceName: 'analytics-service',
});

module.exports = { tracer, zipkinMiddleware };
