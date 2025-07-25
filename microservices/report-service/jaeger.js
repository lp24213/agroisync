const { initTracer } = require('jaeger-client');

const config = {
  serviceName: 'report-service',
  reporter: {
    logSpans: true,
    agentHost: process.env.JAEGER_AGENT_HOST || 'localhost',
    agentPort: process.env.JAEGER_AGENT_PORT || 6832,
  },
  sampler: { type: 'const', param: 1 },
};
const options = {};
const tracer = initTracer(config, options);

module.exports = tracer;
