/**
 * API Functions para Next.js Static Export - AGROISYNC.COM
 * 
 * Este arquivo substitui as rotas de API dinâmicas por funções funcionais
 * que funcionam perfeitamente com output: 'export'
 */

// Configuração da API backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.agroisync.com';

// Interface para respostas da API
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

// Função genérica para fazer requisições HTTP
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AGROISYNC-Frontend/2.0',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Funções funcionais para substituir as rotas de API

// GET request
export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'GET' });
}

// POST request
export async function apiPost<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// PUT request
export async function apiPut<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// DELETE request
export async function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}

// Funções específicas para autenticação
export async function loginUser(credentials: { email: string; password: string }) {
  return apiPost('/auth/login', credentials);
}

export async function registerUser(userData: { 
  email: string; 
  password: string; 
  name: string; 
  phone?: string; 
}) {
  return apiPost('/auth/register', userData);
}

export async function forgotPassword(email: string) {
  return apiPost('/auth/forgot-password', { email });
}

export async function verifyEmail(token: string) {
  return apiPost('/auth/verify-email', { token });
}

export async function sendSMS(phone: string) {
  return apiPost('/auth/send-sms', { phone });
}

export async function verifySMS(phone: string, code: string) {
  return apiPost('/auth/verify-sms', { phone, code });
}

export async function loginMetamask(address: string, signature: string) {
  return apiPost('/auth/login-metamask', { address, signature });
}

export async function resendVerification(email: string) {
  return apiPost('/auth/resend-verification', { email });
}

// Funções para dados do usuário
export async function getUserProfile() {
  return apiGet('/user/profile');
}

export async function updateUserProfile(profileData: any) {
  return apiPut('/user/profile', profileData);
}

// Funções para dashboard
export async function getDashboardData() {
  return apiGet('/dashboard');
}

export async function getAnalytics(period: string) {
  return apiGet(`/analytics?period=${period}`);
}

// Funções para commodities
export async function getCommodityPrices(symbols: string[]) {
  return apiGet(`/commodities/prices?symbols=${symbols.join(',')}`);
}

export async function getCommodityHistory(symbol: string, period: string) {
  return apiGet(`/commodities/history/${symbol}?period=${period}`);
}

// Funções para NFTs
export async function getNFTValuation(tokenId: string, contractAddress: string) {
  return apiPost('/nft/valuation', { tokenId, contractAddress });
}

export async function mintNFT(nftData: any) {
  return apiPost('/nft/mint', nftData);
}

// Funções para staking
export async function getStakingInfo() {
  return apiGet('/staking/info');
}

export async function stakeTokens(amount: string, token: string) {
  return apiPost('/staking/stake', { amount, token });
}

export async function unstakeTokens(amount: string, token: string) {
  return apiPost('/staking/unstake', { amount, token });
}

// Funções para farming
export async function getFarmingPools() {
  return apiGet('/farming/pools');
}

export async function startFarming(poolId: string, amount: string) {
  return apiPost('/farming/start', { poolId, amount });
}

export async function stopFarming(poolId: string) {
  return apiPost('/farming/stop', { poolId });
}

// Funções para smart contracts
export async function deploySmartContract(contractData: any) {
  return apiPost('/smart-contracts/deploy', contractData);
}

export async function executeSmartContract(contractId: string, functionName: string, params: any[]) {
  return apiPost('/smart-contracts/execute', { contractId, functionName, params });
}

// Funções para monitoramento
export async function getSystemHealth() {
  return apiGet('/health');
}

export async function getPerformanceMetrics() {
  return apiGet('/metrics/performance');
}

// Funções para notificações
export async function subscribeToNotifications(settings: any) {
  return apiPost('/notifications/subscribe', settings);
}

export async function getNotifications() {
  return apiGet('/notifications');
}

// Funções para configurações
export async function getAppSettings() {
  return apiGet('/settings');
}

export async function updateAppSettings(settings: any) {
  return apiPut('/settings', settings);
}

// Função para verificar se a API está funcionando
export async function checkApiHealth(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return {
        success: true,
        data: { status: 'healthy', timestamp: new Date().toISOString() },
      };
    } else {
      return {
        success: false,
        error: `API Health Check Failed: ${response.status}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'API Health Check Failed',
    };
  }
}

// Exportar todas as funções
export default {
  // Métodos HTTP
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  
  // Autenticação
  loginUser,
  registerUser,
  forgotPassword,
  verifyEmail,
  sendSMS,
  verifySMS,
  loginMetamask,
  resendVerification,
  
  // Usuário
  getUserProfile,
  updateUserProfile,
  
  // Dashboard
  getDashboardData,
  getAnalytics,
  
  // Commodities
  getCommodityPrices,
  getCommodityHistory,
  
  // NFTs
  getNFTValuation,
  mintNFT,
  
  // Staking
  getStakingInfo,
  stakeTokens,
  unstakeTokens,
  
  // Farming
  getFarmingPools,
  startFarming,
  stopFarming,
  
  // Smart Contracts
  deploySmartContract,
  executeSmartContract,
  
  // Monitoramento
  getSystemHealth,
  getPerformanceMetrics,
  
  // Notificações
  subscribeToNotifications,
  getNotifications,
  
  // Configurações
  getAppSettings,
  updateAppSettings,
  
  // Health Check
  checkApiHealth,
};
