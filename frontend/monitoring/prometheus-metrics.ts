import { NextApiRequest, NextApiResponse } from 'next';
import client from 'prom-client';

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duração das requisições HTTP em ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [50, 100, 200, 300, 400, 500, 1000, 2000]
});

export default async function prometheusMetricsHandler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
}

export { httpRequestDurationMicroseconds };
