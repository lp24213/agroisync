import axios from 'axios';

class AgrofitService {
  constructor() {
    this.baseUrl = 'https://api.cnptia.embrapa.br/agrofit/v1';
  }

  // Buscar classes e categorias agronômicas
  async getClassesCategorias() {
    const response = await axios.get(`${this.baseUrl}/classes-categorias-agronomicas`);
    return response.data;
  }

  // Buscar defensivos por categoria
  async getDefensivosPorCategoria(categoriaId) {
    const response = await axios.get(`${this.baseUrl}/defensivos?categoria=${categoriaId}`);
    return response.data;
  }

  // Buscar detalhes de um defensivo
  async getDefensivoDetalhes(defensivoId) {
    const response = await axios.get(`${this.baseUrl}/defensivos/${defensivoId}`);
    return response.data;
  }
}

const agrofitService = new AgrofitService();
export default agrofitService;
