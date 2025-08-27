import axios from 'axios';

// Configuração da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Configurações do Baidu Maps
const BAIDU_CONFIG = {
  // Em produção, usar chaves reais via backend
  // apiKey: process.env.REACT_APP_BAIDU_MAPS_API_KEY,
  baseUrl: 'https://api.map.baidu.com',
  geocodingUrl: 'https://api.map.baidu.com/geocoding/v3',
  reverseGeocodingUrl: 'https://api.map.baidu.com/reverse_geocoding/v3',
  placeSearchUrl: 'https://api.map.baidu.com/place/v2/search',
  routeUrl: 'https://api.map.baidu.com/direction/v2',
  // Coordenadas padrão do Brasil (São Paulo)
  defaultLocation: {
    lat: -23.5505,
    lng: -46.6333
  }
};

// Tipos de busca de localização
export const LOCATION_TYPES = {
  'ADDRESS': 'endereço',
  'COORDINATES': 'coordenadas',
  'PLACE': 'local',
  'ROUTE': 'rota'
};

// Tipos de transporte para rotas
export const TRANSPORT_MODES = {
  'DRIVING': 'carro',
  'WALKING': 'a pé',
  'TRANSIT': 'transporte público',
  'BICYCLING': 'bicicleta'
};

class BaiduMapsService {
  constructor() {
    this.isInitialized = false;
    this.mapInstance = null;
    this.geocoder = null;
    this.placeSearch = null;
    this.routeSearch = null;
  }

  // Inicializar o serviço
  async initialize() {
    try {
      // Em produção, verificar se o script do Baidu Maps foi carregado
      if (typeof window !== 'undefined' && window.BMap) {
        this.isInitialized = true;
        console.log('Baidu Maps inicializado com sucesso');
        return { success: true };
      } else {
        // Fallback para desenvolvimento
        console.log('Baidu Maps não disponível, usando serviço mockado');
        this.isInitialized = true;
        return { success: true, mock: true };
      }
    } catch (error) {
      console.error('Erro ao inicializar Baidu Maps:', error);
      return { success: false, error: error.message };
    }
  }

  // Geocoding: converter endereço em coordenadas
  async geocodeAddress(address, city = '', state = '', country = 'Brasil') {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Em produção, usar API real do Baidu
      // const response = await axios.get(`${BAIDU_CONFIG.geocodingUrl}`, {
      //   params: {
      //     address: `${address}, ${city}, ${state}, ${country}`,
      //     output: 'json',
      //     ak: BAIDU_CONFIG.apiKey
      //   }
      // });

      // Simular geocoding para desenvolvimento
      const mockGeocoding = await this.mockGeocoding(address, city, state);
      
      return {
        success: true,
        location: mockGeocoding.location,
        formattedAddress: mockGeocoding.formattedAddress,
        confidence: mockGeocoding.confidence
      };
    } catch (error) {
      console.error('Erro no geocoding:', error);
      throw error;
    }
  }

  // Reverse Geocoding: converter coordenadas em endereço
  async reverseGeocode(lat, lng) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Em produção, usar API real do Baidu
      // const response = await axios.get(`${BAIDU_CONFIG.reverseGeocodingUrl}`, {
      //   params: {
      //     location: `${lat},${lng}`,
      //     output: 'json',
      //     ak: BAIDU_CONFIG.apiKey
      //   }
      // });

      // Simular reverse geocoding para desenvolvimento
      const mockReverseGeocoding = await this.mockReverseGeocoding(lat, lng);
      
      return {
        success: true,
        address: mockReverseGeocoding.address,
        formattedAddress: mockReverseGeocoding.formattedAddress,
        components: mockReverseGeocoding.components
      };
    } catch (error) {
      console.error('Erro no reverse geocoding:', error);
      throw error;
    }
    }

  // Buscar lugares próximos
  async searchNearbyPlaces(query, lat, lng, radius = 5000, type = '') {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Em produção, usar API real do Baidu
      // const response = await axios.get(`${BAIDU_CONFIG.placeSearchUrl}`, {
      //   params: {
      //     query,
      //     location: `${lat},${lng}`,
      //     radius,
      //     type,
      //     output: 'json',
      //     ak: BAIDU_CONFIG.apiKey
      //   }
      // });

      // Simular busca de lugares para desenvolvimento
      const mockPlaces = await this.mockPlaceSearch(query, lat, lng, radius);
      
      return {
        success: true,
        places: mockPlaces,
        total: mockPlaces.length
      };
    } catch (error) {
      console.error('Erro na busca de lugares:', error);
      throw error;
    }
  }

  // Calcular rota entre dois pontos
  async calculateRoute(origin, destination, mode = 'DRIVING') {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Em produção, usar API real do Baidu
      // const response = await axios.get(`${BAIDU_CONFIG.routeUrl}`, {
      //   params: {
      //     origin: `${origin.lat},${origin.lng}`,
      //     destination: `${destination.lat},${destination.lng}`,
      //     mode: mode.toLowerCase(),
      //     output: 'json',
      //     ak: BAIDU_CONFIG.apiKey
      //   }
      // });

      // Simular cálculo de rota para desenvolvimento
      const mockRoute = await this.mockRouteCalculation(origin, destination, mode);
      
      return {
        success: true,
        route: mockRoute,
        distance: mockRoute.distance,
        duration: mockRoute.duration,
        steps: mockRoute.steps
      };
    } catch (error) {
      console.error('Erro no cálculo de rota:', error);
      throw error;
    }
  }

  // Validar endereço brasileiro
  async validateBrazilianAddress(cep, address, city, state) {
    try {
      // Primeiro validar CEP
      const cepValidation = await this.validateCEP(cep);
      if (!cepValidation.valid) {
        return {
          valid: false,
          error: 'CEP inválido',
          details: cepValidation
        };
      }

      // Validar endereço
      const addressValidation = await this.validateAddress(address, city, state);
      if (!addressValidation.valid) {
        return {
          valid: false,
          error: 'Endereço inválido',
          details: addressValidation
        };
      }

      // Geocoding para confirmar coordenadas
      const geocoding = await this.geocodeAddress(address, city, state);
      
      return {
        valid: true,
        cep: cepValidation,
        address: addressValidation,
        coordinates: geocoding.location,
        formattedAddress: geocoding.formattedAddress
      };
    } catch (error) {
      console.error('Erro na validação de endereço:', error);
      return {
        valid: false,
        error: 'Erro na validação',
        details: error.message
      };
    }
  }

  // Validar CEP via API do IBGE
  async validateCEP(cep) {
    try {
      // Remover caracteres não numéricos
      const cleanCEP = cep.replace(/\D/g, '');
      
      if (cleanCEP.length !== 8) {
        return {
          valid: false,
          error: 'CEP deve ter 8 dígitos'
        };
      }

      // Em produção, usar API real do IBGE
      // const response = await axios.get(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      
      // Simular validação de CEP para desenvolvimento
      const mockCEPValidation = await this.mockCEPValidation(cleanCEP);
      
      return {
        valid: mockCEPValidation.valid,
        cep: cleanCEP,
        address: mockCEPValidation.address,
        city: mockCEPValidation.city,
        state: mockCEPValidation.state,
        ibge: mockCEPValidation.ibge
      };
    } catch (error) {
      console.error('Erro na validação de CEP:', error);
      return {
        valid: false,
        error: 'Erro na validação do CEP'
      };
    }
  }

  // Validar endereço
  async validateAddress(address, city, state) {
    try {
      if (!address || address.trim().length < 5) {
        return {
          valid: false,
          error: 'Endereço deve ter pelo menos 5 caracteres'
        };
      }

      if (!city || city.trim().length < 2) {
        return {
          valid: false,
          error: 'Cidade deve ter pelo menos 2 caracteres'
        };
      }

      if (!state || state.trim().length !== 2) {
        return {
          valid: false,
          error: 'Estado deve ter 2 caracteres (UF)'
        };
      }

      // Validar UF brasileira
      const validStates = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
      ];

      if (!validStates.includes(state.toUpperCase())) {
        return {
          valid: false,
          error: 'UF inválida'
        };
      }

      return {
        valid: true,
        address: address.trim(),
        city: city.trim(),
        state: state.toUpperCase()
      };
    } catch (error) {
      console.error('Erro na validação de endereço:', error);
      return {
        valid: false,
        error: 'Erro na validação'
      };
    }
  }

  // Obter coordenadas de uma cidade
  async getCityCoordinates(city, state) {
    try {
      // Em produção, usar API real
      // const response = await axios.get(`${API_BASE_URL}/maps/city-coordinates`, {
      //   params: { city, state }
      // });

      // Simular coordenadas de cidade para desenvolvimento
      const mockCityCoordinates = await this.mockCityCoordinates(city, state);
      
      return {
        success: true,
        city,
        state,
        coordinates: mockCityCoordinates.coordinates,
        timezone: mockCityCoordinates.timezone
      };
    } catch (error) {
      console.error('Erro ao obter coordenadas da cidade:', error);
      throw error;
    }
  }

  // Métodos mockados para desenvolvimento
  async mockGeocoding(address, city, state) {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Gerar coordenadas baseadas no endereço (simulação)
    const baseLat = -23.5505 + (Math.random() - 0.5) * 10;
    const baseLng = -46.6333 + (Math.random() - 0.5) * 10;

    return {
      location: {
        lat: baseLat,
        lng: baseLng
      },
      formattedAddress: `${address}, ${city}, ${state}, Brasil`,
      confidence: Math.floor(Math.random() * 30) + 70 // 70-100%
    };
  }

  async mockReverseGeocoding(lat, lng) {
    await new Promise(resolve => setTimeout(resolve, 300));

    const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Salvador'];
    const states = ['SP', 'RJ', 'MG', 'DF', 'BA'];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomState = states[Math.floor(Math.random() * states.length)];

    return {
      address: `Rua Exemplo, 123`,
      formattedAddress: `Rua Exemplo, 123, ${randomCity}, ${randomState}, Brasil`,
      components: {
        street: 'Rua Exemplo',
        number: '123',
        city: randomCity,
        state: randomState,
        country: 'Brasil'
      }
    };
  }

  async mockPlaceSearch(query, lat, lng, radius) {
    await new Promise(resolve => setTimeout(resolve, 400));

    const places = [];
    const placeTypes = ['restaurante', 'farmácia', 'posto de gasolina', 'supermercado', 'banco'];
    
    for (let i = 0; i < Math.floor(Math.random() * 5) + 3; i++) {
      const randomLat = lat + (Math.random() - 0.5) * 0.01;
      const randomLng = lng + (Math.random() - 0.5) * 0.01;
      
      places.push({
        id: `place_${i}`,
        name: `${query} ${i + 1}`,
        type: placeTypes[Math.floor(Math.random() * placeTypes.length)],
        location: {
          lat: randomLat,
          lng: randomLng
        },
        distance: Math.floor(Math.random() * radius),
        rating: (Math.random() * 2 + 3).toFixed(1) // 3.0 - 5.0
      });
    }

    return places;
  }

  async mockRouteCalculation(origin, destination, mode) {
    await new Promise(resolve => setTimeout(resolve, 600));

    // Calcular distância aproximada
    const latDiff = destination.lat - origin.lat;
    const lngDiff = destination.lng - origin.lng;
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111000; // km

    // Calcular duração baseada no modo
    let duration;
    switch (mode) {
      case 'DRIVING':
        duration = distance / 60; // 60 km/h
        break;
      case 'WALKING':
        duration = distance / 5; // 5 km/h
        break;
      case 'TRANSIT':
        duration = distance / 30; // 30 km/h
        break;
      case 'BICYCLING':
        duration = distance / 20; // 20 km/h
        break;
      default:
        duration = distance / 60;
    }

    // Gerar passos da rota
    const steps = [];
    const numSteps = Math.floor(Math.random() * 5) + 3;
    
    for (let i = 0; i < numSteps; i++) {
      steps.push({
        instruction: `Passo ${i + 1}: ${mode === 'DRIVING' ? 'Continue reto' : 'Siga em frente'}`,
        distance: Math.floor(distance / numSteps),
        duration: Math.floor(duration / numSteps * 60) // em segundos
      });
    }

    return {
      distance: Math.floor(distance),
      duration: Math.floor(duration * 60), // em segundos
      steps,
      mode
    };
  }

  async mockCEPValidation(cep) {
    await new Promise(resolve => setTimeout(resolve, 200));

    // Simular CEPs válidos
    const validCEPs = {
      '01310100': { city: 'São Paulo', state: 'SP', ibge: '3550308' },
      '20040020': { city: 'Rio de Janeiro', state: 'RJ', ibge: '3304557' },
      '30112000': { city: 'Belo Horizonte', state: 'MG', ibge: '3106200' },
      '70040901': { city: 'Brasília', state: 'DF', ibge: '5300108' },
      '40015000': { city: 'Salvador', state: 'BA', ibge: '2927408' }
    };

    const cepData = validCEPs[cep];
    if (cepData) {
      return {
        valid: true,
        address: `Rua Exemplo, Centro`,
        city: cepData.city,
        state: cepData.state,
        ibge: cepData.ibge
      };
    } else {
      return {
        valid: false,
        error: 'CEP não encontrado'
      };
    }
  }

  async mockCityCoordinates(city, state) {
    await new Promise(resolve => setTimeout(resolve, 250));

    const cityCoordinates = {
      'São Paulo': { lat: -23.5505, lng: -46.6333, timezone: 'America/Sao_Paulo' },
      'Rio de Janeiro': { lat: -22.9068, lng: -43.1729, timezone: 'America/Sao_Paulo' },
      'Belo Horizonte': { lat: -19.9167, lng: -43.9345, timezone: 'America/Sao_Paulo' },
      'Brasília': { lat: -15.7942, lng: -47.8822, timezone: 'America/Sao_Paulo' },
      'Salvador': { lat: -12.9714, lng: -38.5011, timezone: 'America/Sao_Paulo' }
    };

    const coordinates = cityCoordinates[city] || {
      lat: -23.5505 + (Math.random() - 0.5) * 10,
      lng: -46.6333 + (Math.random() - 0.5) * 10,
      timezone: 'America/Sao_Paulo'
    };

    return {
      coordinates,
      timezone: coordinates.timezone
    };
  }

  // Desconectar serviço
  disconnect() {
    try {
      this.isInitialized = false;
      this.mapInstance = null;
      this.geocoder = null;
      this.placeSearch = null;
      this.routeSearch = null;
      
      console.log('Serviço de Baidu Maps desconectado');
      return { success: true };
    } catch (error) {
      console.error('Erro ao desconectar serviço de Baidu Maps:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new BaiduMapsService();
