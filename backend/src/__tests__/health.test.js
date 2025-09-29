/**
 * Testes para Health Check endpoints
 */

import request from 'supertest';
import express from 'express';
import healthCheckRoutes from '../routes/health-check.js';

const app = express();
app.use('/health-check', healthCheckRoutes);

describe('Health Check Endpoints', () => {
  describe('GET /health-check', () => {
    it('deve retornar status 200 e resposta JSON', async () => {
      const response = await request(app)
        .get('/health-check')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body.status).toBe('ok');
    });
  });

  describe('GET /health-check/detailed', () => {
    it('deve retornar health check detalhado', async () => {
      const response = await request(app)
        .get('/health-check/detailed')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('checks');
      expect(response.body).toHaveProperty('memory');
      expect(response.body.checks).toHaveProperty('api');
      expect(response.body.checks).toHaveProperty('database');
    });

    it('deve incluir métricas de memória', async () => {
      const response = await request(app).get('/health-check/detailed').expect(200);

      expect(response.body.memory).toHaveProperty('used');
      expect(response.body.memory).toHaveProperty('total');
      expect(response.body.memory).toHaveProperty('unit');
      expect(response.body.memory.unit).toBe('MB');
    });
  });

  describe('GET /health-check/ready', () => {
    it('deve retornar readiness status', async () => {
      const response = await request(app).get('/health-check/ready').expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('status');
      expect(['ready', 'not_ready']).toContain(response.body.status);
    });
  });

  describe('GET /health-check/live', () => {
    it('deve retornar liveness status', async () => {
      const response = await request(app)
        .get('/health-check/live')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('alive');
    });
  });

  describe('GET /health-check/metrics', () => {
    it('deve retornar métricas do sistema', async () => {
      const response = await request(app)
        .get('/health-check/metrics')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('uptime_seconds');
      expect(response.body).toHaveProperty('memory_used_mb');
      expect(response.body).toHaveProperty('memory_total_mb');
      expect(response.body).toHaveProperty('node_version');
      expect(response.body).toHaveProperty('platform');
    });

    it('deve retornar valores numéricos válidos', async () => {
      const response = await request(app).get('/health-check/metrics').expect(200);

      expect(typeof response.body.uptime_seconds).toBe('number');
      expect(typeof response.body.memory_used_mb).toBe('number');
      expect(response.body.uptime_seconds).toBeGreaterThan(0);
      expect(response.body.memory_used_mb).toBeGreaterThan(0);
    });
  });
});
