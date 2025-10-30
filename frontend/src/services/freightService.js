import axios from 'axios';
import { API_CONFIG } from '../config/constants.js';

// Configuração da API
const API_BASE_URL = API_CONFIG.baseURL;

// Helper para pegar token
const getAuthToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('authToken');
};

// Helper para headers com auth
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Tipos de caminhão
export const TRUCK_TYPES = {
  truck_3_4: { label: 'Truck 3/4', icon: '🚛', capacity: '3-4 ton' },
  truck_toco: { label: 'Truck Toco', icon: '🚛', capacity: '6-8 ton' },
  truck_truck: { label: 'Truck Truck', icon: '🚛', capacity: '8-10 ton' },
  truck_carreta: { label: 'Carreta', icon: '🚛', capacity: '25-30 ton' },
  truck_pickup: { label: 'Pickup', icon: '🚛', capacity: '1-2 ton' },
  truck_van: { label: 'Van', icon: '🚛', capacity: '1-3 ton' }
};

// Tipos de carga
export const CARGO_TYPES = {
  grains: { label: 'Grãos', icon: '🌾', category: 'Agricultura' },
  vegetables: { label: 'Hortifruti', icon: '🥬', category: 'Agricultura' },
  livestock: { label: 'Animais Vivos', icon: '🐄', category: 'Pecuária' },
  machinery: { label: 'Maquinários', icon: '🚜', category: 'Equipamentos' },
  fertilizers: { label: 'Fertilizantes', icon: '🌱', category: 'Agricultura' },
  general: { label: 'Carga Geral', icon: '📦', category: 'Diversos' }
};

// Estados do frete
export const FREIGHT_STATUS = {
  available: {
    name: 'Disponível',
    color: 'bg-green-100 text-green-800',
    description: 'Frete disponível para contratação'
  },
  negotiating: {
    name: 'Em Negociação',
    color: 'bg-blue-100 text-blue-800',
    description: 'Freteiro e anunciante negociando'
  },
  agreed: {
    name: 'Acordado',
    color: 'bg-emerald-100 text-emerald-800',
    description: 'Termos acordados entre as partes'
  },
  in_transit: {
    name: 'Em Trânsito',
    color: 'bg-purple-100 text-purple-800',
    description: 'Carga em transporte'
  },
  completed: {
    name: 'Concluído',
    color: 'bg-gray-100 text-gray-800',
    description: 'Frete finalizado com sucesso'
  },
  cancelled: {
    name: 'Cancelado',
    color: 'bg-red-100 text-red-800',
    description: 'Frete foi cancelado'
  }
};

class FreightService {
  // Criar novo frete
  async createFreight(freightData) {
    try {
      console.log('🚛 Criando frete:', freightData);
      const response = await axios.post(`${API_BASE_URL}/freight`, freightData, {
        headers: getAuthHeaders()
      });
      console.log('✅ Frete criado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar frete:', error.response?.data || error);
      
      // Se der erro 403 (limite atingido ou plano expirado), redirecionar para planos
      if (error.response?.status === 403) {
        console.log('🚫 Erro 403 - Redirecionando para /plans');
        window.location.href = '/plans';
        return;
      }
      
      throw error;
    }
  }

  // Buscar fretes públicos
  async getPublicFreights(filters = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/freights/public`, { params: filters });
      return response.data;
    } catch (error) {
      // Silenciar erro - retornar mock data
      return this.getMockPublicFreights(filters);
    }
  }

  // Buscar fretes do usuário
  async getUserFreights(userId, type = 'all') {
    try {
      const params = type === 'all' ? { userId } : { userId, type };
      const response = await axios.get(`${API_BASE_URL}/freights/user/${userId}`, { params });
      return response.data;
    } catch (error) {
      // Silenciar erro - retornar mock data
      return this.getMockUserFreights(userId, type);
    }
  }

  // Buscar fretes do usuário logado (meus fretes)
  async getMyFreights() {
    try {
      console.log('🚛 Buscando meus fretes...');
      const response = await axios.get(`${API_BASE_URL}/user/items?type=freights`, {
        headers: getAuthHeaders()
      });
      console.log('✅ Meus fretes:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar meus fretes:', error);
      // Retornar estrutura vazia ao invés de array vazio
      return { success: false, freights: [], data: { freights: [] } };
    }
  }

  // Buscar frete por ID
  async getFreightById(freightId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/freights/${freightId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar frete:', error);
      return this.getMockFreightById(freightId);
    }
  }

  // Atualizar frete
  async updateFreight(freightId, updateData) {
    try {
      const response = await axios.patch(`${API_BASE_URL}/freights/${freightId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar frete:', error);
      return this.updateMockFreight(freightId, updateData);
    }
  }

  // Deletar frete
  async deleteFreight(freightId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/freights/${freightId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar frete:', error);
      return this.deleteMockFreight(freightId);
    }
  }

  // Aplicar para frete (criar transação)
  async applyForFreight(freightId, userId, applicationData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/freights/${freightId}/apply`, {
        userId,
        ...applicationData
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao aplicar para frete:', error);
      return this.createMockFreightApplication(freightId, userId, applicationData);
    }
  }

  // Buscar aplicações de um frete
  async getFreightApplications(freightId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/freights/${freightId}/applications`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar aplicações:', error);
      return this.getMockFreightApplications(freightId);
    }
  }

  // Buscar fretes por localização (Baidu Maps)
  async searchFreightsByLocation(origin, destination, radius = 50) {
    try {
      const response = await axios.get(`${API_BASE_URL}/freights/search/location`, {
        params: { origin, destination, radius }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar por localização:', error);
      return this.searchMockFreightsByLocation(origin, destination, radius);
    }
  }

  // Criar frete mock para desenvolvimento
  createMockFreight(freightData) {
    const mockFreight = {
      id: `FREIGHT_${Date.now()}`,
      ...freightData,
      status: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applications: [],
      views: 0,
      favorites: 0,
      rating: 0,
      reviews: []
    };

    // Salvar no localStorage para simular persistência
    const existingFreights = JSON.parse(localStorage.getItem('agroisync_freights') || '[]');
    existingFreights.push(mockFreight);
    localStorage.setItem('agroisync_freights', JSON.stringify(existingFreights));

    return mockFreight;
  }

  // Buscar fretes públicos mock
  getMockPublicFreights(filters = {}) {
    try {
      let allFreights = JSON.parse(localStorage.getItem('agroisync_freights') || '[]');

      // Aplicar filtros
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        allFreights = allFreights.filter(
          freight =>
            freight.origin.toLowerCase().includes(searchTerm) ||
            freight.destination.toLowerCase().includes(searchTerm) ||
            freight.description.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.truckTypes && filters.truckTypes.length > 0) {
        allFreights = allFreights.filter(freight => filters.truckTypes.includes(freight.truckType));
      }

      if (filters.minPrice) {
        allFreights = allFreights.filter(freight => freight.price >= parseFloat(filters.minPrice));
      }

      if (filters.maxPrice) {
        allFreights = allFreights.filter(freight => freight.price <= parseFloat(filters.maxPrice));
      }

      if (filters.minWeight) {
        allFreights = allFreights.filter(freight => freight.weight >= parseFloat(filters.minWeight));
      }

      if (filters.maxWeight) {
        allFreights = allFreights.filter(freight => freight.weight <= parseFloat(filters.maxWeight));
      }

      // Ordenar
      if (filters.sortBy === 'price_low') {
        allFreights.sort((a, b) => a.price - b.price);
      } else if (filters.sortBy === 'price_high') {
        allFreights.sort((a, b) => b.price - a.price);
      } else if (filters.sortBy === 'date') {
        allFreights.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else {
        allFreights.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      return allFreights;
    } catch (error) {
      // Silenciar erro
      return [];
    }
  }

  // Buscar fretes do usuário mock
  getMockUserFreights(userId, type = 'all') {
    try {
      const allFreights = JSON.parse(localStorage.getItem('agroisync_freights') || '[]');
      let userFreights = allFreights.filter(freight => freight.userId === userId);

      if (type === 'posted') {
        userFreights = userFreights.filter(freight => freight.status === 'available');
      } else if (type === 'applied') {
        // Buscar fretes onde o usuário aplicou
        const applications = JSON.parse(localStorage.getItem('agroisync_freight_applications') || '[]');
        const appliedFreightIds = applications.filter(app => app.userId === userId).map(app => app.freightId);
        userFreights = allFreights.filter(freight => appliedFreightIds.includes(freight.id));
      }

      return userFreights.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      // Silenciar erro
      return [];
    }
  }

  // Buscar frete por ID mock
  getMockFreightById(freightId) {
    try {
      const allFreights = JSON.parse(localStorage.getItem('agroisync_freights') || '[]');
      return allFreights.find(freight => freight.id === freightId) || null;
    } catch (error) {
      console.error('Erro ao buscar frete por ID mock:', error);
      return null;
    }
  }

  // Atualizar frete mock
  updateMockFreight(freightId, updateData) {
    try {
      const allFreights = JSON.parse(localStorage.getItem('agroisync_freights') || '[]');
      const freightIndex = allFreights.findIndex(freight => freight.id === freightId);

      if (freightIndex !== -1) {
        allFreights[freightIndex] = {
          ...allFreights[freightIndex],
          ...updateData,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('agroisync_freights', JSON.stringify(allFreights));
        return allFreights[freightIndex];
      }

      return null;
    } catch (error) {
      console.error('Erro ao atualizar frete mock:', error);
      return null;
    }
  }

  // Deletar frete mock
  deleteMockFreight(freightId) {
    try {
      const allFreights = JSON.parse(localStorage.getItem('agroisync_freights') || '[]');
      const filteredFreights = allFreights.filter(freight => freight.id !== freightId);
      localStorage.setItem('agroisync_freights', JSON.stringify(filteredFreights));
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar frete mock:', error);
      return { success: false, error: error.message };
    }
  }

  // Criar aplicação mock para frete
  createMockFreightApplication(freightId, userId, applicationData) {
    const mockApplication = {
      id: `APP_${Date.now()}`,
      freightId,
      userId,
      ...applicationData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Salvar aplicação
    const existingApplications = JSON.parse(localStorage.getItem('agroisync_freight_applications') || '[]');
    existingApplications.push(mockApplication);
    localStorage.setItem('agroisync_freight_applications', JSON.stringify(existingApplications));

    // Atualizar contador de aplicações no frete
    const allFreights = JSON.parse(localStorage.getItem('agroisync_freights') || '[]');
    const freightIndex = allFreights.findIndex(freight => freight.id === freightId);
    if (freightIndex !== -1) {
      allFreights[freightIndex].applications.push(mockApplication.id);
      localStorage.setItem('agroisync_freights', JSON.stringify(allFreights));
    }

    return mockApplication;
  }

  // Buscar aplicações mock de um frete
  getMockFreightApplications(freightId) {
    try {
      const allApplications = JSON.parse(localStorage.getItem('agroisync_freight_applications') || '[]');
      return allApplications.filter(app => app.freightId === freightId);
    } catch (error) {
      console.error('Erro ao buscar aplicações mock:', error);
      return [];
    }
  }

  // Buscar fretes por localização mock
  searchMockFreightsByLocation(origin, destination, radius = 50) {
    try {
      const allFreights = JSON.parse(localStorage.getItem('agroisync_freights') || '[]');

      // Simular busca por localização (em produção seria integrado com Baidu Maps)
      return allFreights.filter(
        freight =>
          freight.origin.toLowerCase().includes(origin.toLowerCase()) ||
          freight.destination.toLowerCase().includes(destination.toLowerCase())
      );
    } catch (error) {
      console.error('Erro ao buscar por localização mock:', error);
      return [];
    }
  }

  // Gerar dados mock iniciais para demonstração
  generateMockData() {
    const mockFreights = [
      {
        id: 'FREIGHT_1',
        userId: 'user_1',
        origin: 'São Paulo, SP',
        destination: 'Rio de Janeiro, RJ',
        weight: 5000,
        price: 850.0,
        date: '2024-01-20',
        description: 'Transporte de grãos de soja para porto',
        truckType: 'truck_toco',
        cargoType: 'grains',
        requirements: 'Caminhão com baú fechado, temperatura controlada',
        insurance: true,
        negotiable: true,
        status: 'available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        applications: [],
        views: 15,
        favorites: 3,
        rating: 4.8,
        reviews: []
      },
      {
        id: 'FREIGHT_2',
        userId: 'user_2',
        origin: 'Goiânia, GO',
        destination: 'Brasília, DF',
        weight: 2000,
        price: 450.0,
        date: '2024-01-18',
        description: 'Transporte de hortifruti para CEASA',
        truckType: 'truck_3_4',
        cargoType: 'vegetables',
        requirements: 'Caminhão refrigerado',
        insurance: false,
        negotiable: true,
        status: 'available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        applications: [],
        views: 8,
        favorites: 1,
        rating: 4.5,
        reviews: []
      },
      {
        id: 'FREIGHT_3',
        userId: 'user_3',
        origin: 'Curitiba, PR',
        destination: 'Porto Alegre, RS',
        weight: 15000,
        price: 1200.0,
        date: '2024-01-25',
        description: 'Transporte de maquinários agrícolas',
        truckType: 'truck_carreta',
        cargoType: 'machinery',
        requirements: 'Carreta com rampa hidráulica',
        insurance: true,
        negotiable: false,
        status: 'available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        applications: [],
        views: 22,
        favorites: 5,
        rating: 4.9,
        reviews: []
      }
    ];

    localStorage.setItem('agroisync_freights', JSON.stringify(mockFreights));
    return mockFreights;
  }
}

const freightService = new FreightService();
export default freightService;
