import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
// import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DescribeTableCommand } from '@aws-sdk/client-dynamodb';

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
// const docClient = DynamoDBDocumentClient.from(dynamoClient);

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  service: string;
  version: string;
  uptime: number;
  memory: NodeJS.MemoryUsage;
  environment: string;
  checks: {
    lambda: 'healthy' | 'unhealthy';
    dynamodb: 'healthy' | 'unhealthy' | 'degraded';
    memory: 'healthy' | 'unhealthy';
  };
}

// Check DynamoDB connectivity
async function checkDynamoDB(): Promise<'healthy' | 'unhealthy' | 'degraded'> {
  try {
    const tablePrefix = process.env.DYNAMODB_TABLE_PREFIX || 'agroisync';
    const tableName = `${tablePrefix}-users-${process.env.NODE_ENV || 'production'}`;
    
    const command = new DescribeTableCommand({ TableName: tableName });
    await dynamoClient.send(command);
    
    return 'healthy';
  } catch (error: any) {
    console.error('DynamoDB health check failed:', error);
    
    // Check if it's a permissions issue (degraded) vs connection issue (unhealthy)
    if (error.name === 'AccessDeniedException' || error.name === 'ResourceNotFoundException') {
      return 'degraded';
    }
    
    return 'unhealthy';
  }
}

// Check memory usage
function checkMemory(): 'healthy' | 'unhealthy' {
  const memoryUsage = process.memoryUsage();
  const memoryUsageMB = memoryUsage.heapUsed / 1024 / 1024;
  const maxMemoryMB = parseInt(process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE || '1024', 10);
  
  // Consider unhealthy if using more than 80% of allocated memory
  if (memoryUsageMB > maxMemoryMB * 0.8) {
    return 'unhealthy';
  }
  
  return 'healthy';
}

// Main health check handler
export const handler = async (
  _event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const startTime = Date.now();
  
  try {
    // Perform health checks
    const [dynamodbStatus, memoryStatus] = await Promise.all([
      checkDynamoDB(),
      Promise.resolve(checkMemory())
    ]);
    
    // Determine overall status
    let overallStatus: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
    
    if (dynamodbStatus === 'unhealthy' || memoryStatus === 'unhealthy') {
      overallStatus = 'unhealthy';
    } else if (dynamodbStatus === 'degraded') {
      overallStatus = 'degraded';
    }
    
    // Prepare response
    const healthStatus: HealthStatus = {
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
    } else if (overallStatus === 'degraded') {
      statusCode = 200; // OK but degraded
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
    console.error('Health check handler error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'AGROISYNC Backend Health Check',
        error: 'Health check failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, null, 2)
    };
  }
};
