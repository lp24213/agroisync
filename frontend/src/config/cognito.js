// Configuração do AWS Cognito para AGROSYNC
export const COGNITO_CONFIG = {
  UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID || 'us-east-1_XXXXXXXXX',
  ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID || 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
  Region: process.env.REACT_APP_AWS_REGION || 'us-east-1'
}

// Configuração do pool de usuários
export const USER_POOL_CONFIG = {
  UserPoolId: COGNITO_CONFIG.UserPoolId,
  ClientId: COGNITO_CONFIG.ClientId,
  Region: COGNITO_CONFIG.Region
}

// Configuração do pool de identidades (se necessário)
export const IDENTITY_POOL_CONFIG = {
  IdentityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID || 'us-east-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  Region: COGNITO_CONFIG.Region
}

// URLs de redirecionamento
export const COGNITO_URLS = {
  SignIn: `https://${COGNITO_CONFIG.UserPoolId}.auth.${COGNITO_CONFIG.Region}.amazoncognito.com/login`,
  SignUp: `https://${COGNITO_CONFIG.UserPoolId}.auth.${COGNITO_CONFIG.Region}.amazoncognito.com/signup`,
  ForgotPassword: `https://${COGNITO_CONFIG.UserPoolId}.auth.${COGNITO_CONFIG.Region}.amazoncognito.com/forgotPassword`
}

// Configurações de cookies
export const COOKIE_CONFIG = {
  name: 'agrosync_auth_token',
  expires: 7, // 7 dias
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
}
