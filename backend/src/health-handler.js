const { DynamoDBClient, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');

const logger = require('./utils/logger.js');
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });

// Check DynamoDB connectivity
async function checkDynamoDB() {
  try {
    const tablePrefix = process.env.DYNAMODB_TABLE_PREFIX || 'agroisync';
    const tableName = `${tablePrefix}-users-${process.env.NODE_ENV || 'production'}`;

    const command = new DescribeTableCommand({ TableName: tableName });
    await dynamoClient.send(command);

    return 'healthy';
  } catch (error) {
    // eslint-disable-next-line no-console
    logger.error('DynamoDB health check failed:', error);

    if (
      error &&
      (error.name === 'AccessDeniedException' || error.name === 'ResourceNotFoundException')
    ) {
      return 'degraded';
    }

    return 'unhealthy';
  }
}

// Check memory usage
function checkMemory() {
  const memoryUsage = process.memoryUsage();
  const memoryUsageMB = memoryUsage.heapUsed / 1024 / 1024;
  const maxMemoryMB = parseInt(process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE || '1024', 10, 10);

  // Consider unhealthy if using more than 80% of allocated memory
  if (memoryUsageMB > maxMemoryMB * 0.8) {
    return 'unhealthy';
  }

  return 'healthy';
}

// Main health check handler
exports.handler = async function handler(_event, _context) {
  const startTime = Date.now();

  try {
    // Perform health checks
    const [dynamodbStatus, memoryStatus] = await Promise.all([
      checkDynamoDB(),
      Promise.resolve(checkMemory())
    ]);

    // Determine overall status
    let overallStatus = 'healthy';

    if (dynamodbStatus === 'unhealthy' || memoryStatus === 'unhealthy') {
      overallStatus = 'unhealthy';
    } else if (dynamodbStatus === 'degraded') {
      overallStatus = 'degraded';
    }

    // Prepare response
    const healthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      service: 'AGROISYNC Backend Health Check',
      version: '2.3.1',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'unknown',
      checks: {
        lambda: 'healthy',
        dynamodb: dynamodbStatus,
        memory: memoryStatus
      }
    };

    // Set appropriate HTTP status code
    let statusCode = 200;
    if (overallStatus === 'unhealthy') {
      statusCode = 503; // Service Unavailable
    }

    // Add response time header
    const responseTime = Date.now() - startTime;

    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Response-Time': `${responseTime}ms`,
        'X-Health-Status': overallStatus
      },
      body: JSON.stringify(healthStatus, null, 2)
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    logger.error('Health check handler error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify(
        {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          service: 'AGROISYNC Backend Health Check',
          error: 'Health check failed',
          message: error && error.message ? error.message : 'Unknown error'
        },
        null,
        2
      )
    };
  }
};
