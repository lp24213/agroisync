import axios from 'axios';

// Configuração da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Categorias principais do agronegócio
export const PRODUCT_CATEGORIES = {
  'graos': {
    name: 'Grãos',
    icon: '🌾',
    subcategories: ['Soja', 'Milho', 'Trigo', 'Arroz', 'Feijão', 'Cevada', 'Aveia'],
    color: 'from-emerald-500 to-emerald-600'
  },
  'sementes': {
    name: 'Sementes',
    icon: '🌱',
    subcategories: ['Soja', 'Milho', 'Trigo', 'Hortifruti', 'Forrageiras', 'Florestais'],
    color: 'from-green-500 to-green-600'
  },
  'fertilizantes': {
    name: 'Fertilizantes',
    icon: '🧪',
    subcategories: ['NPK', 'Orgânicos', 'Micronutrientes', 'Corretivos', 'Biofertilizantes'],
    color: 'from-blue-500 to-blue-600'
  },
  'maquinarios': {
    name: 'Maquinários',
    icon: '🚜',
    subcategories: ['Tratores', 'Colheitadeiras', 'Plantadeiras', 'Pulverizadores', 'Implementos'],
    color: 'from-orange-500 to-orange-600'
  },
  'insumos': {
    name: 'Insumos',
    icon: '🔧',
    subcategories: ['Defensivos', 'Vacinas', 'Rações', 'Suplementos', 'Equipamentos'],
    color: 'from-purple-500 to-purple-600'
  },
  'cafe': {
    name: 'Café',
    icon: '☕',
    subcategories: ['Arábica', 'Robusta', 'Especial', 'Gourmet', 'Orgânico'],
    color: 'from-amber-500 to-amber-600'
  },
  'frutas': {
    name: 'Frutas',
    icon: '🍎',
    subcategories: ['Cítricas', 'Tropicais', 'Temperadas', 'Exóticas', 'Orgânicas'],
    color: 'from-red-500 to-red-600'
  },
  'hortalicas': {
    name: 'Hortaliças',
    icon: '🥬',
    subcategories: ['Folhosas', 'Raízes', 'Legumes', 'Temperos', 'Orgânicos'],
    color: 'from-lime-500 to-lime-600'
  },
  'carnes': {
    name: 'Carnes',
    icon: '🥩',
    subcategories: ['Bovina', 'Suína', 'Aviária', 'Caprina', 'Ovina', 'Orgânicas'],
    color: 'from-rose-500 to-rose-600'
  },
  'laticinios': {
    name: 'Laticínios',
    icon: '🥛',
    subcategories: ['Leite', 'Queijos', 'Iogurtes', 'Manteigas', 'Orgânicos'],
    color: 'from-cyan-500 to-cyan-600'
  },
  'servicos': {
    name: 'Serviços',
    icon: '🛠️',
    subcategories: ['Consultoria', 'Análises', 'Transporte', 'Armazenagem', 'Tecnologia'],
    color: 'from-indigo-500 to-indigo-600'
  }
};

// Estados de produto
export const PRODUCT_STATUS = {
  'active': { name: 'Ativo', color: 'bg-green-100 text-green-800' },
  'pending': { name: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  'sold': { name: 'Vendido', color: 'bg-blue-100 text-blue-800' },
  'inactive': { name: 'Inativo', color: 'bg-gray-100 text-gray-800' },
  'reserved': { name: 'Reservado', color: 'bg-purple-100 text-purple-800' }
};

// Serviço de produtos
class ProductService {
  // Buscar todos os produtos
  async getProducts(filters = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      // Retornar produtos mock para desenvolvimento
      return this.getMockProducts(filters);
    }
  }

  // Buscar produto por ID
  async getProductById(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return null;
    }
  }

  // Criar novo produto
  async createProduct(productData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/products`, productData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  }

  // Atualizar produto
  async updateProduct(id, productData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  }

  // Deletar produto
  async deleteProduct(id) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  }

  // Buscar produtos do usuário
  async getUserProducts(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/products`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos do usuário:', error);
      return [];
    }
  }

  // Buscar produtos por categoria
  async getProductsByCategory(category) {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      return [];
    }
  }

  // Buscar produtos por localização
  async getProductsByLocation(location) {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/location/${location}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos por localização:', error);
      return [];
    }
  }

  // Aplicar filtros aos produtos
  applyFilters(products, filters) {
    let filtered = [...products];

    // Filtro por busca
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.seller?.name?.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por categoria
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }

    // Filtro por localização
    if (filters.locations && filters.locations.length > 0) {
      filtered = filtered.filter(product => 
        filters.locations.includes(product.location)
      );
    }

    // Filtro por preço
    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(filters.maxPrice));
    }

    // Filtro por avaliação
    if (filters.minRating) {
      filtered = filtered.filter(product => product.rating >= filters.minRating);
    }

    // Ordenação
    switch (filters.sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        // Relevância (mantém ordem original)
        break;
    }

    return filtered;
  }

  // Produtos mock para desenvolvimento
  getMockProducts(filters = {}) {
    const mockProducts = []; // VAZIO até usuários cadastrarem seus produtos

    // Aplicar filtros se fornecidos
    if (Object.keys(filters).length > 0) {
      return this.applyFilters(mockProducts, filters);
    }

    return mockProducts;
  }

  // Buscar categorias
  getCategories() {
    return Object.entries(PRODUCT_CATEGORIES).map(([key, category]) => ({
      key,
      ...category
    }));
  }

  // Buscar localizações
  getLocations() {
    return [
      'Mato Grosso, MT',
      'Paraná, PR',
      'São Paulo, SP',
      'Goiás, GO',
      'Rio Grande do Sul, RS',
      'Minas Gerais, MG',
      'Bahia, BA',
      'Mato Grosso do Sul, MS',
      'Tocantins, TO',
      'Maranhão, MA'
    ];
  }

  // Validar produto
  validateProduct(product) {
    const errors = [];

    if (!product.name || product.name.trim().length < 3) {
      errors.push('Nome do produto deve ter pelo menos 3 caracteres');
    }

    if (!product.category) {
      errors.push('Categoria é obrigatória');
    }

    if (!product.price || product.price <= 0) {
      errors.push('Preço deve ser maior que zero');
    }

    if (!product.description || product.description.trim().length < 10) {
      errors.push('Descrição deve ter pelo menos 10 caracteres');
    }

    if (!product.stock || product.stock < 0) {
      errors.push('Estoque deve ser maior ou igual a zero');
    }

    if (!product.unit) {
      errors.push('Unidade é obrigatória');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

const productService = new ProductService();
export default productService;
