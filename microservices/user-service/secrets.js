// Exemplo de integração com AWS Secrets Manager, GCP Secret Manager e Azure Key Vault
// Use bibliotecas oficiais e variáveis de ambiente para selecionar o provider

const getSecret = async (key) => {
  if (process.env.SECRETS_PROVIDER === 'aws') {
    const {
      SecretsManagerClient,
      GetSecretValueCommand,
    } = require('@aws-sdk/client-secrets-manager');
    const client = new SecretsManagerClient({ region: process.env.AWS_REGION });
    const data = await client.send(new GetSecretValueCommand({ SecretId: key }));
    return data.SecretString;
  } else if (process.env.SECRETS_PROVIDER === 'gcp') {
    const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
    const client = new SecretManagerServiceClient();
    const [version] = await client.accessSecretVersion({ name: key });
    return version.payload.data.toString();
  } else if (process.env.SECRETS_PROVIDER === 'azure') {
    const { DefaultAzureCredential } = require('@azure/identity');
    const { SecretClient } = require('@azure/keyvault-secrets');
    const credential = new DefaultAzureCredential();
    const client = new SecretClient(process.env.AZURE_KEY_VAULT_URL, credential);
    const secret = await client.getSecret(key);
    return secret.value;
  } else {
    throw new Error('Provider de secrets não suportado');
  }
};

module.exports = { getSecret };
