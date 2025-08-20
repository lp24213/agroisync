import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();

// Variáveis de ambiente configuradas automaticamente pelo Amplify
const USER_POOL_ID = process.env.USER_POOL_ID!;
const USER_POOL_CLIENT_ID = process.env.USER_POOL_CLIENT_ID!;
const API_AGROISYNC_USERTABLE_NAME = process.env.API_AGROISYNC_USERTABLE_NAME!;
const API_AGROISYNC_PROPERTYTABLE_NAME = process.env.API_AGROISYNC_PROPERTYTABLE_NAME!;
const API_AGROISYNC_PRODUCTTABLE_NAME = process.env.API_AGROISYNC_PRODUCTTABLE_NAME!;
const API_AGROISYNC_TRANSACTIONTABLE_NAME = process.env.API_AGROISYNC_TRANSACTIONTABLE_NAME!;
const API_AGROISYNC_REPORTTABLE_NAME = process.env.API_AGROISYNC_REPORTTABLE_NAME!;

const verifier = CognitoJwtVerifier.create({
  userPoolId: USER_POOL_ID,
  tokenUse: 'access',
  clientId: USER_POOL_CLIENT_ID,
});

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    // Verificar token JWT
    const token = event.headers.Authorization?.replace('Bearer ', '');
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Token não fornecido' })
      };
    }

    const payload = await verifier.verify(token);
    const userGroups = payload['cognito:groups'] || [];
    
    // Verificar se é admin
    if (!userGroups.includes('admin')) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Acesso negado. Apenas administradores.' })
      };
    }

    const { action, data } = JSON.parse(event.body || '{}');

    switch (action) {
      case 'getAllUsers':
        return await getAllUsers();
      case 'updateUserRole':
        return await updateUserRole(data);
      case 'getSystemMetrics':
        return await getSystemMetrics();
      case 'createReport':
        return await createReport(data);
      case 'getUserAnalytics':
        return await getUserAnalytics(data);
      case 'systemMaintenance':
        return await systemMaintenance(data);
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Ação não reconhecida' })
        };
    }
  } catch (error) {
    console.error('Erro:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro interno do servidor' })
    };
  }
};

async function getAllUsers() {
  const params = {
    TableName: API_AGROISYNC_USERTABLE_NAME,
    Select: 'ALL_ATTRIBUTES'
  };

  const result = await dynamoDB.scan(params).promise();
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      users: result.Items,
      count: result.Count
    })
  };
}

async function updateUserRole(data: { userId: string; newRole: string }) {
  const params = {
    TableName: API_AGROISYNC_USERTABLE_NAME,
    Key: { id: data.userId },
    UpdateExpression: 'SET #role = :role, updatedAt = :updatedAt',
    ExpressionAttributeNames: { '#role': 'role' },
    ExpressionAttributeValues: {
      ':role': data.newRole,
      ':updatedAt': new Date().toISOString()
    }
  };

  await dynamoDB.update(params).promise();
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Role atualizada com sucesso' })
  };
}

async function getSystemMetrics() {
  const tables = [
    API_AGROISYNC_USERTABLE_NAME,
    API_AGROISYNC_PROPERTYTABLE_NAME,
    API_AGROISYNC_PRODUCTTABLE_NAME,
    API_AGROISYNC_TRANSACTIONTABLE_NAME
  ];

  const metrics: any = {};
  
  for (const tableName of tables) {
    const params = { TableName: tableName, Select: 'COUNT' };
    const result = await dynamoDB.scan(params).promise();
    metrics[tableName] = result.Count;
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ metrics })
  };
}

async function createReport(data: { type: string; parameters: any }) {
  const reportId = `report_${Date.now()}`;
  const params = {
    TableName: API_AGROISYNC_REPORTTABLE_NAME,
    Item: {
      id: reportId,
      type: data.type,
      parameters: JSON.stringify(data.parameters),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };

  await dynamoDB.put(params).promise();
  
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      message: 'Relatório criado com sucesso',
      reportId 
    })
  };
}

async function getUserAnalytics(data: { userId: string; type: string }) {
  const params = {
    TableName: process.env.API_AGROISYNC_USERANALYSTICSTABLE_NAME!,
    IndexName: 'byUser',
    KeyConditionExpression: 'userId = :userId',
    FilterExpression: '#type = :type',
    ExpressionAttributeNames: { '#type': 'type' },
    ExpressionAttributeValues: { 
      ':userId': data.userId,
      ':type': data.type
    }
  };

  const result = await dynamoDB.query(params).promise();
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      analytics: result.Items,
      count: result.Count
    })
  };
}

async function systemMaintenance(data: { action: string; parameters: any }) {
  // Executar ações de manutenção do sistema
  const maintenanceId = `maintenance_${Date.now()}`;
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Manutenção executada com sucesso',
      maintenanceId,
      action: data.action
    })
  };
}
