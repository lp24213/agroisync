import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { DynamoDB, S3 } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();
const s3 = new S3();

// Variáveis de ambiente configuradas automaticamente pelo Amplify
const USER_POOL_ID = process.env.USER_POOL_ID;
const USER_POOL_CLIENT_ID = process.env.USER_POOL_CLIENT_ID;
const API_AGROISYNC_NFTTABLE_NAME = process.env.API_AGROISYNC_NFTTABLE_NAME;
const API_AGROISYNC_TRANSACTIONTABLE_NAME = process.env.API_AGROISYNC_TRANSACTIONTABLE_NAME;
const STORAGE_AGROISYNCS3_BUCKETNAME = process.env.STORAGE_AGROISYNCS3_BUCKETNAME;

const verifier = CognitoJwtVerifier.create({
  userPoolId: USER_POOL_ID,
  tokenUse: 'access',
  clientId: USER_POOL_CLIENT_ID,
});

export const handler = async (event, context) => {
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
      case 'createNFT':
        return await createNFT(userId, data);
      case 'mintNFT':
        return await mintNFT(userId, data);
      case 'getNFTs':
        return await getNFTs(userId);
      case 'getNFT':
        return await getNFT(data.nftId);
      case 'updateNFT':
        return await updateNFT(userId, data);
      case 'deleteNFT':
        return await deleteNFT(userId, data);
      case 'transferNFT':
        return await transferNFT(userId, data);
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

async function createNFT(userId, data) {
  const nftId = `nft_${Date.now()}_${userId}`;
  const tokenId = `AGROISYNC_${Date.now()}`;
  
  const nftParams = {
    TableName: API_AGROISYNC_NFTTABLE_NAME,
    Item: {
      id: nftId,
      tokenId,
      name: data.name,
      description: data.description,
      image: data.image,
      metadata: JSON.stringify({
        name: data.name,
        description: data.description,
        image: data.image,
        attributes: data.attributes || [],
        collection: data.collection || 'AGROISYNC'
      }),
      userId,
      collection: data.collection || 'AGROISYNC',
      attributes: data.attributes || [],
      isMinted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };

  await dynamoDB.put(nftParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'NFT criado com sucesso',
      nftId,
      tokenId
    })
  };
}

async function mintNFT(userId, data) {
  // Verificar se o NFT existe e pertence ao usuário
  const nftParams = {
    TableName: API_AGROISYNC_NFTTABLE_NAME,
    Key: { id: data.nftId }
  };

  const nftResult = await dynamoDB.get(nftParams).promise();
  if (!nftResult.Item || nftResult.Item.userId !== userId) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'NFT não encontrado' })
    };
  }

  const nft = nftResult.Item;
  
  if (nft.isMinted) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'NFT já foi mintado' })
    };
  }

  // Atualizar NFT como mintado
  const updateParams = {
    TableName: API_AGROISYNC_NFTTABLE_NAME,
    Key: { id: data.nftId },
    UpdateExpression: 'SET isMinted = :isMinted, mintTransactionHash = :mintTransactionHash, mintDate = :mintDate, updatedAt = :updatedAt',
    ExpressionAttributeValues: {
      ':isMinted': true,
      ':mintTransactionHash': data.transactionHash,
      ':mintDate': new Date().toISOString(),
      ':updatedAt': new Date().toISOString()
    }
  };

  await dynamoDB.update(updateParams).promise();

  // Criar transação
  const transactionId = `tx_${Date.now()}_${userId}`;
  const transactionParams = {
    TableName: API_AGROISYNC_TRANSACTIONTABLE_NAME,
    Item: {
      id: transactionId,
      type: 'NFT_MINT',
      amount: 0, // NFT mint não tem valor monetário
      status: 'COMPLETED',
      description: `NFT ${nft.name} mintado com sucesso`,
      userId,
      relatedId: data.nftId,
      relatedType: 'NFT',
      transactionHash: data.transactionHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };

  await dynamoDB.put(transactionParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'NFT mintado com sucesso',
      nftId: data.nftId,
      tokenId: nft.tokenId,
      transactionId
    })
  };
}

async function getNFTs(userId) {
  const params = {
    TableName: API_AGROISYNC_NFTTABLE_NAME,
    IndexName: 'byOwner',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId }
  };

  const result = await dynamoDB.query(params).promise();
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      nfts: result.Items,
      count: result.Count
    })
  };
}

async function getNFT(nftId) {
  const params = {
    TableName: API_AGROISYNC_NFTTABLE_NAME,
    Key: { id: nftId }
  };

  const result = await dynamoDB.get(params).promise();
  
  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'NFT não encontrado' })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      nft: result.Item
    })
  };
}

async function updateNFT(userId, data) {
  // Verificar se o NFT existe e pertence ao usuário
  const nftParams = {
    TableName: API_AGROISYNC_NFTTABLE_NAME,
    Key: { id: data.nftId }
  };

  const nftResult = await dynamoDB.get(nftParams).promise();
  if (!nftResult.Item || nftResult.Item.userId !== userId) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'NFT não encontrado' })
    };
  }

  const nft = nftResult.Item;
  
  if (nft.isMinted) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'NFT já mintado não pode ser editado' })
    };
  }

  // Construir expressão de atualização dinâmica
  const updateExpressions = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  if (data.name) {
    updateExpressions.push('#name = :name');
    expressionAttributeNames['#name'] = 'name';
    expressionAttributeValues[':name'] = data.name;
  }

  if (data.description) {
    updateExpressions.push('#description = :description');
    expressionAttributeNames['#description'] = 'description';
    expressionAttributeValues[':description'] = data.description;
  }

  if (data.attributes) {
    updateExpressions.push('#attributes = :attributes');
    expressionAttributeNames['#attributes'] = 'attributes';
    expressionAttributeValues[':attributes'] = data.attributes;
  }

  if (updateExpressions.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Nenhum campo para atualizar' })
    };
  }

  updateExpressions.push('#updatedAt = :updatedAt');
  expressionAttributeValues[':updatedAt'] = new Date().toISOString();

  const updateParams = {
    TableName: API_AGROISYNC_NFTTABLE_NAME,
    Key: { id: data.nftId },
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues
  };

  await dynamoDB.update(updateParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'NFT atualizado com sucesso'
    })
  };
}

async function deleteNFT(userId, data) {
  // Verificar se o NFT existe e pertence ao usuário
  const nftParams = {
    TableName: API_AGROISYNC_NFTTABLE_NAME,
    Key: { id: data.nftId }
  };

  const nftResult = await dynamoDB.get(nftParams).promise();
  if (!nftResult.Item || nftResult.Item.userId !== userId) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'NFT não encontrado' })
    };
  }

  const nft = nftResult.Item;
  
  if (nft.isMinted) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'NFT já mintado não pode ser deletado' })
    };
  }

  // Deletar NFT
  await dynamoDB.delete(nftParams).promise();

  // Deletar imagem do S3 se existir
  if (nft.image && nft.image.startsWith('s3://')) {
    try {
      const bucket = STORAGE_AGROISYNCS3_BUCKETNAME;
      const key = nft.image.replace(`s3://${bucket}/`, '');
      
      await s3.deleteObject({
        Bucket: bucket,
        Key: key
      }).promise();
    } catch (s3Error) {
      console.warn('Erro ao deletar imagem do S3:', s3Error);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'NFT deletado com sucesso'
    })
  };
}

async function transferNFT(userId, data) {
  // Verificar se o NFT existe e pertence ao usuário
  const nftParams = {
    TableName: API_AGROISYNC_NFTTABLE_NAME,
    Key: { id: data.nftId }
  };

  const nftResult = await dynamoDB.get(nftParams).promise();
  if (!nftResult.Item || nftResult.Item.userId !== userId) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'NFT não encontrado' })
    };
  }

  const nft = nftResult.Item;
  
  if (!nft.isMinted) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'NFT não mintado não pode ser transferido' })
    };
  }

  // Transferir NFT
  const updateParams = {
    TableName: API_AGROISYNC_NFTTABLE_NAME,
    Key: { id: data.nftId },
    UpdateExpression: 'SET userId = :newOwnerId, updatedAt = :updatedAt',
    ExpressionAttributeValues: {
      ':newOwnerId': data.newOwnerId,
      ':updatedAt': new Date().toISOString()
    }
  };

  await dynamoDB.update(updateParams).promise();

  // Criar transação de transferência
  const transactionId = `tx_${Date.now()}_${userId}`;
  const transactionParams = {
    TableName: API_AGROISYNC_TRANSACTIONTABLE_NAME,
    Item: {
      id: transactionId,
      type: 'NFT_TRANSFER',
      amount: 0,
      status: 'COMPLETED',
      description: `NFT ${nft.name} transferido para ${data.newOwnerId}`,
      userId,
      relatedId: data.nftId,
      relatedType: 'NFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };

  await dynamoDB.put(transactionParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'NFT transferido com sucesso',
      nftId: data.nftId,
      newOwnerId: data.newOwnerId
    })
  };
}
