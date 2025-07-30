import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'graphql';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import dotenv from 'dotenv';
import winston from 'winston';

import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { context } from './context';
import { dataSources } from './datasources';
import { plugins } from './plugins';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

async function startApolloServer() {
  // Create Express app
  const app = express();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));

  // CORS
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  }));

  // Compression
  app.use(compression());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use('/graphql', limiter);

  // Slow down
  const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 50, // allow 50 requests per 15 minutes, then...
    delayMs: 500, // begin adding 500ms of delay per request above 50
  });
  app.use('/graphql', speedLimiter);

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'agrotm-graphql',
      environment: NODE_ENV,
    });
  });

  // Create schema
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  // Create Apollo Server
  const server = new ApolloServer({
    schema,
    context,
    dataSources,
    plugins,
    introspection: NODE_ENV !== 'production',
    playground: NODE_ENV !== 'production',
    formatError: (error) => {
      logger.error('GraphQL Error:', error);
      
      // Don't expose internal errors in production
      if (NODE_ENV === 'production') {
        return {
          message: 'Internal server error',
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        };
      }
      
      return error;
    },
    formatResponse: (response, requestContext) => {
      // Log slow queries
      const duration = Date.now() - requestContext.request.startTime;
      if (duration > 1000) {
        logger.warn(`Slow query detected: ${duration}ms`, {
          query: requestContext.request.query,
          variables: requestContext.request.variables,
          duration,
        });
      }
      
      return response;
    },
  });

  await server.start();

  // Apply middleware
  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: false, // We handle CORS manually
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Create WebSocket server for subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // Set up WebSocket server
  useServer(
    {
      schema,
      context,
      onConnect: (ctx) => {
        logger.info('Client connected to WebSocket');
      },
      onDisconnect: (ctx) => {
        logger.info('Client disconnected from WebSocket');
      },
    },
    wsServer
  );

  // Start server
  httpServer.listen(PORT, () => {
    logger.info(`🚀 GraphQL server ready at http://localhost:${PORT}${server.graphqlPath}`);
    logger.info(`🔌 WebSocket server ready at ws://localhost:${PORT}${server.graphqlPath}`);
    logger.info(`📊 Apollo Studio available at https://studio.apollographql.com`);
  });

  // Graceful shutdown
  const gracefulShutdown = (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    httpServer.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });

    // Force close after 30 seconds
    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 30000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
}

startApolloServer().catch((error) => {
  logger.error('Failed to start Apollo Server:', error);
  process.exit(1);
}); 