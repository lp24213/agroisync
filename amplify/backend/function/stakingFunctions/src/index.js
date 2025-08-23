import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();

// Variáveis de ambiente configuradas automaticamente pelo Amplify
const USER_POOL_ID = process.env.USER_POOL_ID!;
const USER_POOL_CLIENT_ID = process.env.USER_POOL_CLIENT_ID!;
const API_AGROISYNC_STAKINGPOOLTABLE_NAME = process.env.API_AGROISYNC_STAKINGPOOLTABLE_NAME!;
const API_AGROISYNC_STAKINGRECORDTABLE_NAME = process.env.API_AGROISYNC_STAKINGRECORDTABLE_NAME!;

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
    const userId = payload.sub;
    const userGroups = payload['cognito:groups'] || [];

    const { action, data } = JSON.parse(event.body || '{}');

    switch (action) {
      case 'stake':
        return await stake(userId, data);
      case 'unstake':
        return await unstake(userId, data);
      case 'claimRewards':
        return await claimRewards(userId, data);
      case 'getStakingInfo':
        return await getStakingInfo(userId);
      case 'getPools':
        return await getPools();
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

async function stake(userId: string, data: { poolId: string; amount: number }) {
  // Verificar se o pool existe e está ativo
  const poolParams = {
    TableName: API_AGROISYNC_STAKINGPOOLTABLE_NAME,
    Key: { id: data.poolId }
  };

  const poolResult = await dynamoDB.get(poolParams).promise();
  if (!poolResult.Item || !poolResult.Item.isActive) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Pool não encontrado ou inativo' })
    };
  }

  const pool = poolResult.Item;
  
  // Verificar limites
  if (data.amount < pool.minStake) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: `Valor mínimo para staking é ${pool.minStake}` })
    };
  }

  if (pool.maxStake && data.amount > pool.maxStake) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: `Valor máximo para staking é ${pool.maxStake}` })
    };
  }

  // Criar registro de staking
  const stakingId = `staking_${Date.now()}_${userId}`;
  const stakingParams = {
    TableName: API_AGROISYNC_STAKINGRECORDTABLE_NAME,
    Item: {
      id: stakingId,
      userId,
      poolId: data.poolId,
      amount: data.amount,
      startDate: new Date().toISOString(),
      status: 'ACTIVE',
      rewards: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };

  await dynamoDB.put(stakingParams).promise();

  // Atualizar pool
  const updatePoolParams = {
    TableName: API_AGROISYNC_STAKINGPOOLTABLE_NAME,
    Key: { id: data.poolId },
    UpdateExpression: 'SET totalStaked = totalStaked + :amount, currentParticipants = currentParticipants + :inc',
    ExpressionAttributeValues: { 
      ':amount': data.amount,
      ':inc': 1
    }
  };

  await dynamoDB.update(updatePoolParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Staking realizado com sucesso',
      stakingId,
      amount: data.amount,
      poolName: pool.name
    })
  };
}

async function unstake(userId: string, data: { stakingId: string }) {
  // Buscar registro de staking
  const stakingParams = {
    TableName: API_AGROISYNC_STAKINGRECORDTABLE_NAME,
    Key: { id: data.stakingId }
  };

  const stakingResult = await dynamoDB.get(stakingParams).promise();
  if (!stakingResult.Item || stakingResult.Item.userId !== userId) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Staking não encontrado' })
    };
  }

  const staking = stakingResult.Item;
  
  if (staking.status !== 'ACTIVE') {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Staking não está ativo' })
    };
  }

  // Calcular recompensas
  const startDate = new Date(staking.startDate);
  const endDate = new Date();
  const daysStaked = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Buscar pool para calcular APY
  const poolParams = {
    TableName: API_AGROISYNC_STAKINGPOOLTABLE_NAME,
    Key: { id: staking.poolId }
  };
  
  const poolResult = await dynamoDB.get(poolParams).promise();
  const pool = poolResult.Item;
  
  const rewards = (staking.amount * pool.apy * daysStaked) / 365;

  // Atualizar staking
  const updateStakingParams = {
    TableName: API_AGROISYNC_STAKINGRECORDTABLE_NAME,
    Key: { id: data.stakingId },
    UpdateExpression: 'SET status = :status, endDate = :endDate, rewards = :rewards, updatedAt = :updatedAt',
    ExpressionAttributeValues: {
      ':status': 'COMPLETED',
      ':endDate': endDate.toISOString(),
      ':rewards': rewards,
      ':updatedAt': endDate.toISOString()
    }
  };

  await dynamoDB.update(updateStakingParams).promise();

  // Atualizar pool
  const updatePoolParams = {
    TableName: API_AGROISYNC_STAKINGPOOLTABLE_NAME,
    Key: { id: staking.poolId },
    UpdateExpression: 'SET totalStaked = totalStaked - :amount, totalRewards = totalRewards + :rewards, currentParticipants = currentParticipants - :dec',
    ExpressionAttributeValues: {
      ':amount': staking.amount,
      ':rewards': rewards,
      ':dec': 1
    }
  };

  await dynamoDB.update(updatePoolParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Unstaking realizado com sucesso',
      amount: staking.amount,
      rewards,
      daysStaked
    })
  };
}

async function claimRewards(userId: string, data: { stakingId: string }) {
  // Buscar registro de staking
  const stakingParams = {
    TableName: API_AGROISYNC_STAKINGRECORDTABLE_NAME,
    Key: { id: data.stakingId }
  };

  const stakingResult = await dynamoDB.get(stakingParams).promise();
  if (!stakingResult.Item || stakingResult.Item.userId !== userId) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Staking não encontrado' })
    };
  }

  const staking = stakingResult.Item;
  
  if (staking.status !== 'COMPLETED' || staking.rewards <= 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Nenhuma recompensa disponível para claim' })
    };
  }

  // Atualizar staking
  const updateStakingParams = {
    TableName: API_AGROISYNC_STAKINGRECORDTABLE_NAME,
    Key: { id: data.stakingId },
    UpdateExpression: 'SET status = :status, updatedAt = :updatedAt',
    ExpressionAttributeValues: {
      ':status': 'REWARDED',
      ':updatedAt': new Date().toISOString()
    }
  };

  await dynamoDB.update(updateStakingParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Recompensas reclamadas com sucesso',
      rewards: staking.rewards
    })
  };
}

async function getStakingInfo(userId: string) {
  const params = {
    TableName: API_AGROISYNC_STAKINGRECORDTABLE_NAME,
    IndexName: 'byUser',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId }
  };

  const result = await dynamoDB.query(params).promise();
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      stakings: result.Items,
      count: result.Count
    })
  };
}

async function getPools() {
  const params = {
    TableName: API_AGROISYNC_STAKINGPOOLTABLE_NAME,
    FilterExpression: 'isActive = :isActive',
    ExpressionAttributeValues: { ':isActive': true }
  };

  const result = await dynamoDB.scan(params).promise();
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      pools: result.Items,
      count: result.Count
    })
  };
}
