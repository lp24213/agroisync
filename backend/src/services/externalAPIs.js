import axios from 'axios';

// Configurações das APIs
const API_CONFIG = {
  viacep: {
    baseURL: 'https://viacep.com.br/ws',
    timeout: 10000
  },
  ibge: {
    baseURL: 'https://servicodados.ibge.gov.br/api/v1',
    timeout: 15000
  },
  openweather: {
    baseURL: 'https://api.openweathermap.org/data/2.5',
    apiKey: process.env.OPENWEATHER_API_KEY,
    timeout: 10000
  },
  receitaFederal: {
    baseURL: process.env.RECEITA_FEDERAL_API_URL || 'https://api.receita.fazenda.gov.br',
    apiKey: process.env.RECEITA_FEDERAL_API_KEY,
    timeout: 20000
  }
};

// Classe para serviços de API externa
class ExternalAPIService {
  constructor() {
    this.viacepClient = axios.create({
      baseURL: API_CONFIG.viacep.baseURL,
      timeout: API_CONFIG.viacep.timeout
    });
    
    this.ibgeClient = axios.create({
      baseURL: API_CONFIG.ibge.baseURL,
      timeout: API_CONFIG.ibge.timeout
    });
    
    this.weatherClient = axios.create({
      baseURL: API_CONFIG.openweather.baseURL,
      timeout: API_CONFIG.openweather.timeout
    });
    
    this.receitaClient = axios.create({
      baseURL: API_CONFIG.receitaFederal.baseURL,
      timeout: API_CONFIG.receitaFederal.timeout,
      headers: {
        'Authorization': `Bearer ${API_CONFIG.receitaFederal.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // ===== SERVIÇOS DE CEP E ENDEREÇO =====
  
  /**
   * Consultar CEP via ViaCEP
   * @param {string} cep - CEP a ser consultado
   * @returns {Object} Dados do endereço
   */
  async consultarCEP(cep) {
    try {
      const cleanCEP = cep.replace(/\D/g, '');
      
      if (cleanCEP.length !== 8) {
        throw new Error('CEP deve ter 8 dígitos');
      }
      
      const response = await this.viacepClient.get(`/${cleanCEP}/json/`);
      
      if (response.data.erro) {
        throw new Error('CEP não encontrado');
      }
      
      return {
        success: true,
        data: {
          cep: response.data.cep,
          logradouro: response.data.logradouro,
          complemento: response.data.complemento,
          bairro: response.data.bairro,
          localidade: response.data.localidade,
          uf: response.data.uf,
          ibge: response.data.ibge,
          gia: response.data.gia,
          ddd: response.data.ddd,
          siafi: response.data.siafi
        }
      };
    } catch (error) {
      console.error('Erro ao consultar CEP:', error);
      return {
        success: false,
        message: error.message || 'Erro ao consultar CEP',
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Buscar municípios por estado via IBGE
   * @param {string} uf - Sigla do estado
   * @returns {Array} Lista de municípios
   */
  async buscarMunicipiosPorEstado(uf) {
    try {
      const response = await this.ibgeClient.get(`/localidades/estados/${uf}/municipios`);
      
      return {
        success: true,
        data: response.data.map(municipio => ({
          id: municipio.id,
          nome: municipio.nome,
          microrregiao: municipio.microrregiao?.nome,
          mesorregiao: municipio.mesorregiao?.nome
        }))
      };
    } catch (error) {
      console.error('Erro ao buscar municípios:', error);
      return {
        success: false,
        message: 'Erro ao buscar municípios',
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Buscar estados via IBGE
   * @returns {Array} Lista de estados
   */
  async buscarEstados() {
    try {
      const response = await this.ibgeClient.get('/localidades/estados');
      
      return {
        success: true,
        data: response.data.map(estado => ({
          id: estado.id,
          sigla: estado.sigla,
          nome: estado.nome,
          regiao: estado.regiao?.nome
        }))
      };
    } catch (error) {
      console.error('Erro ao buscar estados:', error);
      return {
        success: false,
        message: 'Erro ao buscar estados',
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Buscar regiões via IBGE
   * @returns {Array} Lista de regiões
   */
  async buscarRegioes() {
    try {
      const response = await this.ibgeClient.get('/localidades/regioes');
      
      return {
        success: true,
        data: response.data.map(regiao => ({
          id: regiao.id,
          nome: regiao.nome,
          sigla: regiao.sigla
        }))
      };
    } catch (error) {
      console.error('Erro ao buscar regiões:', error);
      return {
        success: false,
        message: 'Erro ao buscar regiões',
        error: error.response?.data || error.message
      };
    }
  }

  // ===== SERVIÇOS DE CLIMA =====
  
  /**
   * Obter clima por coordenadas
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @param {string} units - Unidades (metric, imperial, kelvin)
   * @param {string} lang - Idioma (pt, en, es, zh)
   * @returns {Object} Dados do clima
   */
  async obterClimaPorCoordenadas(lat, lon, units = 'metric', lang = 'pt') {
    try {
      if (!API_CONFIG.openweather.apiKey) {
        throw new Error('API key do OpenWeather não configurada');
      }
      
      const response = await this.weatherClient.get('/weather', {
        params: {
          lat,
          lon,
          appid: API_CONFIG.openweather.apiKey,
          units,
          lang
        }
      });
      
      return {
        success: true,
        data: {
          temperatura: response.data.main.temp,
          sensacaoTermica: response.data.main.feels_like,
          umidade: response.data.main.humidity,
          pressao: response.data.main.pressure,
          descricao: response.data.weather[0].description,
          icone: response.data.weather[0].icon,
          vento: {
            velocidade: response.data.wind.speed,
            direcao: response.data.wind.deg
          },
          nuvens: response.data.clouds.all,
          visibilidade: response.data.visibility,
          nascerSol: new Date(response.data.sys.sunrise * 1000),
          porSol: new Date(response.data.sys.sunset * 1000),
          localizacao: {
            nome: response.data.name,
            pais: response.data.sys.country,
            coordenadas: {
              lat: response.data.coord.lat,
              lon: response.data.coord.lon
            }
          }
        }
      };
    } catch (error) {
      console.error('Erro ao obter clima:', error);
      return {
        success: false,
        message: 'Erro ao obter dados do clima',
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Obter clima por IP (usando serviço de geolocalização)
   * @param {string} ip - Endereço IP
   * @param {string} units - Unidades (metric, imperial, kelvin)
   * @param {string} lang - Idioma (pt, en, es, zh)
   * @returns {Object} Dados do clima
   */
  async obterClimaPorIP(ip, units = 'metric', lang = 'pt') {
    try {
      // Primeiro, obter coordenadas pelo IP
      const geoResponse = await this.obterCoordenadasPorIP(ip);
      
      if (!geoResponse.success) {
        throw new Error('Não foi possível obter localização pelo IP');
      }
      
      const { lat, lon } = geoResponse.data;
      
      // Depois, obter clima pelas coordenadas
      return await this.obterClimaPorCoordenadas(lat, lon, units, lang);
    } catch (error) {
      console.error('Erro ao obter clima por IP:', error);
      return {
        success: false,
        message: 'Erro ao obter clima por IP',
        error: error.message
      };
    }
  }

  /**
   * Obter coordenadas por IP
   * @param {string} ip - Endereço IP
   * @returns {Object} Coordenadas (lat, lon)
   */
  async obterCoordenadasPorIP(ip) {
    try {
      // Usar serviço gratuito de geolocalização por IP
      const response = await axios.get(`http://ip-api.com/json/${ip}`, {
        timeout: 10000
      });
      
      if (response.data.status === 'fail') {
        throw new Error('Não foi possível obter localização pelo IP');
      }
      
      return {
        success: true,
        data: {
          lat: response.data.lat,
          lon: response.data.lon,
          cidade: response.data.city,
          estado: response.data.regionName,
          pais: response.data.country,
          timezone: response.data.timezone
        }
      };
    } catch (error) {
      console.error('Erro ao obter coordenadas por IP:', error);
      return {
        success: false,
        message: 'Erro ao obter coordenadas por IP',
        error: error.response?.data || error.message
      };
    }
  }

  // ===== SERVIÇOS DA RECEITA FEDERAL =====
  
  /**
   * Consultar CNPJ na Receita Federal
   * @param {string} cnpj - CNPJ a ser consultado
   * @returns {Object} Dados do CNPJ
   */
  async consultarCNPJ(cnpj) {
    try {
      if (!API_CONFIG.receitaFederal.apiKey) {
        throw new Error('API key da Receita Federal não configurada');
      }
      
      const cleanCNPJ = cnpj.replace(/\D/g, '');
      
      if (cleanCNPJ.length !== 14) {
        throw new Error('CNPJ deve ter 14 dígitos');
      }
      
      // Aqui você implementaria a chamada real para a API da Receita Federal
      // Por enquanto, retornamos dados simulados
      return {
        success: true,
        data: {
          cnpj: cleanCNPJ,
          razaoSocial: 'EMPRESA EXEMPLO LTDA',
          nomeFantasia: 'EMPRESA EXEMPLO',
          dataAbertura: '2020-01-01',
          situacao: 'ATIVA',
          tipo: 'MATRIZ',
          porte: 'MEDIO PORTE',
          naturezaJuridica: '206-2 - LTDA',
          capitalSocial: 100000.00,
          endereco: {
            logradouro: 'Rua Exemplo',
            numero: '123',
            complemento: 'Sala 1',
            bairro: 'Centro',
            municipio: 'São Paulo',
            uf: 'SP',
            cep: '01234-567'
          },
          atividadePrincipal: '4751-2/01 - Comércio varejista de informática',
          atividadesSecundarias: [
            '6201-5/01 - Desenvolvimento de sistemas'
          ]
        }
      };
    } catch (error) {
      console.error('Erro ao consultar CNPJ:', error);
      return {
        success: false,
        message: 'Erro ao consultar CNPJ',
        error: error.message
      };
    }
  }

  /**
   * Consultar CPF na Receita Federal
   * @param {string} cpf - CPF a ser consultado
   * @returns {Object} Dados do CPF
   */
  async consultarCPF(cpf) {
    try {
      if (!API_CONFIG.receitaFederal.apiKey) {
        throw new Error('API key da Receita Federal não configurada');
      }
      
      const cleanCPF = cpf.replace(/\D/g, '');
      
      if (cleanCPF.length !== 11) {
        throw new Error('CPF deve ter 11 dígitos');
      }
      
      // Aqui você implementaria a chamada real para a API da Receita Federal
      // Por enquanto, retornamos dados simulados
      return {
        success: true,
        data: {
          cpf: cleanCPF,
          nome: 'PESSOA EXEMPLO',
          dataNascimento: '1990-01-01',
          situacao: 'REGULAR',
          dataInscricao: '2020-01-01',
          digitoVerificador: '00'
        }
      };
    } catch (error) {
      console.error('Erro ao consultar CPF:', error);
      return {
        success: false,
        message: 'Erro ao consultar CPF',
        error: error.message
      };
    }
  }

  // ===== SERVIÇOS DE VALIDAÇÃO =====
  
  /**
   * Validar endereço completo
   * @param {Object} endereco - Dados do endereço
   * @returns {Object} Endereço validado e complementado
   */
  async validarEndereco(endereco) {
    try {
      let enderecoValidado = { ...endereco };
      
      // Se tem CEP, consultar para complementar dados
      if (endereco.cep) {
        const cepResponse = await this.consultarCEP(endereco.cep);
        
        if (cepResponse.success) {
          enderecoValidado = {
            ...enderecoValidado,
            logradouro: cepResponse.data.logradouro || endereco.logradouro,
            bairro: cepResponse.data.bairro || endereco.bairro,
            cidade: cepResponse.data.localidade || endereco.cidade,
            estado: cepResponse.data.uf || endereco.estado,
            cep: cepResponse.data.cep
          };
        }
      }
      
      // Validar se todos os campos obrigatórios estão preenchidos
      const camposObrigatorios = ['logradouro', 'numero', 'bairro', 'cidade', 'estado', 'cep'];
      const camposFaltando = camposObrigatorios.filter(campo => !enderecoValidado[campo]);
      
      if (camposFaltando.length > 0) {
        return {
          success: false,
          message: `Campos obrigatórios faltando: ${camposFaltando.join(', ')}`,
          camposFaltando
        };
      }
      
      return {
        success: true,
        data: enderecoValidado
      };
    } catch (error) {
      console.error('Erro ao validar endereço:', error);
      return {
        success: false,
        message: 'Erro ao validar endereço',
        error: error.message
      };
    }
  }
}

// Exportar instância única do serviço
export const externalAPIService = new ExternalAPIService();

// Exportar funções individuais para uso direto
export const {
  consultarCEP,
  buscarMunicipiosPorEstado,
  buscarEstados,
  buscarRegioes,
  obterClimaPorCoordenadas,
  obterClimaPorIP,
  obterCoordenadasPorIP,
  consultarCNPJ,
  consultarCPF,
  validarEndereco
} = externalAPIService;
