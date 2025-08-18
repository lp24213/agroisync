import axios from 'axios';

// Configuração base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.agroisync.com';
const API_TIMEOUT = 30000; // 30 segundos

// Instância base do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('authToken');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Serviços da API
export const authService = {
  // Login tradicional
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  // Login com MetaMask
  loginWithMetamask: async (metamaskId: string, signature: string) => {
    const response = await api.post('/api/auth/metamask', { metamaskId, signature });
    return response.data;
  },

  // Registro
  register: async (userData: any) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  // Verificar token
  verifyToken: async () => {
    const response = await api.get('/api/auth/verify');
    return response.data;
  },
};

export const userService = {
  // Obter perfil do usuário
  getProfile: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  // Atualizar perfil
  updateProfile: async (profileData: any) => {
    const response = await api.put('/api/users/profile', profileData);
    return response.data;
  },

  // Alterar senha
  changePassword: async (passwordData: any) => {
    const response = await api.post('/api/users/change-password', passwordData);
    return response.data;
  },
};

export const stakingService = {
  // Fazer stake
  stake: async (stakeData: any) => {
    const response = await api.post('/api/staking/stake', stakeData);
    return response.data;
  },

  // Retirar stake
  unstake: async (unstakeData: any) => {
    const response = await api.post('/api/staking/unstake', unstakeData);
    return response.data;
  },

  // Obter recompensas
  claimRewards: async () => {
    const response = await api.post('/api/staking/claim-rewards');
    return response.data;
  },

  // Obter informações de staking
  getStakingInfo: async () => {
    const response = await api.get('/api/staking/info');
    return response.data;
  },
};

export const nftService = {
  // Obter NFTs do usuário
  getUserNFTs: async () => {
    const response = await api.get('/api/nfts/owned');
    return response.data;
  },

  // Criar NFT
  createNFT: async (nftData: any) => {
    const response = await api.post('/api/nfts/create', nftData);
    return response.data;
  },

  // Transferir NFT
  transferNFT: async (transferData: any) => {
    const response = await api.post('/api/nfts/transfer', transferData);
    return response.data;
  },
};

export const marketplaceService = {
  // Obter listagens
  getListings: async (filters?: any) => {
    const response = await api.get('/api/marketplace/listings', { params: filters });
    return response.data;
  },

  // Criar listagem
  createListing: async (listingData: any) => {
    const response = await api.post('/api/marketplace/listings', listingData);
    return response.data;
  },

  // Comprar item
  buyItem: async (purchaseData: any) => {
    const response = await api.post('/api/marketplace/buy', purchaseData);
    return response.data;
  },
};

export const analyticsService = {
  // Obter análise do portfólio
  getPortfolioAnalytics: async () => {
    const response = await api.get('/api/analytics/portfolio');
    return response.data;
  },

  // Obter estatísticas gerais
  getGeneralStats: async () => {
    const response = await api.get('/api/analytics/stats');
    return response.data;
  },
};

export const uploadService = {
  // Upload de arquivo
  uploadFile: async (file: File, category?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (category) {
      formData.append('category', category);
    }

    const response = await api.post('/api/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Listar arquivos
  getFiles: async () => {
    const response = await api.get('/api/upload/files');
    return response.data;
  },
};

export const contactService = {
  // Enviar mensagem de contato
  sendMessage: async (messageData: any) => {
    const response = await api.post('/api/contact/send', messageData);
    return response.data;
  },
};

export const dashboardService = {
  // Obter visão geral
  getOverview: async () => {
    const response = await api.get('/api/dashboard/overview');
    return response.data;
  },

  // Obter atividade da conta
  getActivity: async () => {
    const response = await api.get('/api/dashboard/activity');
    return response.data;
  },

  // Exportar dados
  exportData: async () => {
    const response = await api.get('/api/dashboard/export');
    return response.data;
  },
};

// Health check
export const healthService = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
