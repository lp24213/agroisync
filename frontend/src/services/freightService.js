import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Freight service
export const freightService = {
  // Get all freights with filters
  async getFreights(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.originCity) params.append('originCity', filters.originCity);
      if (filters.originState) params.append('originState', filters.originState);
      if (filters.destinationCity) params.append('destinationCity', filters.destinationCity);
      if (filters.destinationState) params.append('destinationState', filters.destinationState);
      if (filters.truckType) params.append('truckType', filters.truckType);
      if (filters.minValue) params.append('minValue', filters.minValue);
      if (filters.maxValue) params.append('maxValue', filters.maxValue);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      
      const response = await api.get(`/freights?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching freights:', error);
      throw new Error('Erro ao buscar fretes');
    }
  },

  // Get freight by ID
  async getFreight(id) {
    try {
      const response = await api.get(`/freights/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching freight:', error);
      throw new Error('Erro ao buscar frete');
    }
  },

  // Create new freight
  async createFreight(freightData) {
    try {
      const response = await api.post('/freights', freightData);
      return response.data;
    } catch (error) {
      console.error('Error creating freight:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erro ao cadastrar frete');
    }
  },

  // Update freight
  async updateFreight(id, freightData) {
    try {
      const response = await api.put(`/freights/${id}`, freightData);
      return response.data;
    } catch (error) {
      console.error('Error updating freight:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erro ao atualizar frete');
    }
  },

  // Delete freight (soft delete)
  async deleteFreight(id) {
    try {
      const response = await api.delete(`/freights/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting freight:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erro ao remover frete');
    }
  },

  // Update freight status
  async updateFreightStatus(id, status) {
    try {
      const response = await api.put(`/freights/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating freight status:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erro ao atualizar status do frete');
    }
  }
};

// Export default
export default freightService;
