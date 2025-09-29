import axios from 'axios';
import logger from '../utils/logger.js';

class AddressValidationService {
  constructor() {
    this.apiKeys = {
      correios: process.env.CORREIOS_API_KEY,
      baidu: process.env.BAIDU_MAPS_API_KEY,
      google: process.env.GOOGLE_PLACES_API_KEY
    };
  }

  /**
   * Validar endereço brasileiro usando API dos Correios
   */
  async validateBrazilianAddress(zipCode) {
    try {
      if (!zipCode || zipCode.length !== 8) {
        throw new Error('CEP inválido');
      }

      // API dos Correios (ViaCEP como fallback)
      const response = await axios.get(`https://viacep.com.br/ws/${zipCode}/json/`, {
        timeout: 5000
      });

      if (response.data.erro) {
        throw new Error('CEP não encontrado');
      }

      const address = response.data;

      return {
        isValid: true,
        country: 'BR',
        address: {
          street: address.logradouro,
          neighborhood: address.bairro,
          city: address.localidade,
          state: address.uf,
          zipCode: address.cep,
          country: 'Brasil',
          coordinates: null // ViaCEP não fornece coordenadas
        },
        source: 'viacep'
      };
    } catch (error) {
      logger.error('Erro na validação de endereço brasileiro:', error);
      return {
        isValid: false,
        error: error.message,
        country: 'BR'
      };
    }
  }

  /**
   * Validar endereço chinês usando Baidu Maps API
   */
  async validateChineseAddress(address, city, province) {
    try {
      if (!this.apiKeys.baidu) {
        logger.warn('Baidu Maps API key não configurada');
        return this.mockChineseValidation(address, city, province);
      }

      // Geocoding com Baidu Maps
      const query = `${address}, ${city}, ${province}, China`;
      const response = await axios.get('https://api.map.baidu.com/geocoding/v2/', {
        params: {
          address: query,
          output: 'json',
          ak: this.apiKeys.baidu
        },
        timeout: 5000
      });

      if (response.data.status !== 0) {
        throw new Error('Endereço não encontrado');
      }

      const { result } = response.data;

      return {
        isValid: true,
        country: 'CN',
        address: {
          street: address,
          city,
          province,
          country: 'China',
          coordinates: {
            lat: result.location.lat,
            lng: result.location.lng
          }
        },
        source: 'baidu'
      };
    } catch (error) {
      logger.error('Erro na validação de endereço chinês:', error);
      return {
        isValid: false,
        error: error.message,
        country: 'CN'
      };
    }
  }

  /**
   * Validar endereço usando Google Places API (fallback internacional)
   */
  async validateInternationalAddress(address, country) {
    try {
      if (!this.apiKeys.google) {
        logger.warn('Google Places API key não configurada');
        return this.mockInternationalValidation(address, country);
      }

      // Geocoding com Google Places
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: `${address}, ${country}`,
          key: this.apiKeys.google
        },
        timeout: 5000
      });

      if (response.data.status !== 'OK' || !response.data.results.length) {
        throw new Error('Endereço não encontrado');
      }

      const result = response.data.results[0];
      const components = result.address_components;

      // Extrair componentes do endereço
      const addressComponents = this.extractGoogleAddressComponents(components);

      return {
        isValid: true,
        country,
        address: {
          street: addressComponents.street,
          city: addressComponents.city,
          state: addressComponents.state,
          zipCode: addressComponents.zipCode,
          country: addressComponents.country,
          coordinates: {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng
          }
        },
        source: 'google'
      };
    } catch (error) {
      logger.error('Erro na validação de endereço internacional:', error);
      return {
        isValid: false,
        error: error.message,
        country
      };
    }
  }

  /**
   * Validar endereço baseado no país
   */
  async validateAddress(addressData) {
    const { country, zipCode, address, city, state, province } = addressData;

    switch (country.toUpperCase()) {
      case 'BR':
      case 'BRAZIL':
      case 'BRASIL':
        return await this.validateBrazilianAddress(zipCode);

      case 'CN':
      case 'CHINA':
        return await this.validateChineseAddress(address, city, province);

      default:
        return await this.validateInternationalAddress(address, country);
    }
  }

  /**
   * Extrair componentes de endereço do Google Places
   */
  extractGoogleAddressComponents(components) {
    const result = {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };

    components.forEach(component => {
      const { types } = component;

      if (types.includes('street_number') || types.includes('route')) {
        result.street = component.long_name;
      } else if (types.includes('locality')) {
        result.city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        result.state = component.long_name;
      } else if (types.includes('postal_code')) {
        result.zipCode = component.long_name;
      } else if (types.includes('country')) {
        result.country = component.long_name;
      }
    });

    return result;
  }

  /**
   * Mock para validação chinesa quando API não está disponível
   */
  mockChineseValidation(address, city, province) {
    return {
      isValid: true,
      country: 'CN',
      address: {
        street: address,
        city,
        province,
        country: 'China',
        coordinates: null
      },
      source: 'mock'
    };
  }

  /**
   * Mock para validação internacional quando API não está disponível
   */
  mockInternationalValidation(address, country) {
    return {
      isValid: true,
      country,
      address: {
        street: address,
        city: 'Unknown',
        state: 'Unknown',
        zipCode: 'Unknown',
        country,
        coordinates: null
      },
      source: 'mock'
    };
  }

  /**
   * Formatar endereço para exibição
   */
  formatAddress(addressData) {
    const { street, city, state, zipCode, country } = addressData;

    switch (country.toUpperCase()) {
      case 'BR':
        return `${street}, ${city}, ${state}, ${zipCode}, Brasil`;
      case 'CN':
        return `${street}, ${city}, ${state}, China`;
      default:
        return `${street}, ${city}, ${state}, ${country}`;
    }
  }

  /**
   * Obter lista de países suportados
   */
  getSupportedCountries() {
    return [
      { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
      { code: 'CN', name: 'China', flag: '🇨🇳' },
      { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
      { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
      { code: 'UY', name: 'Uruguai', flag: '🇺🇾' },
      { code: 'PY', name: 'Paraguai', flag: '🇵🇾' },
      { code: 'BO', name: 'Bolívia', flag: '🇧🇴' },
      { code: 'PE', name: 'Peru', flag: '🇵🇪' },
      { code: 'CL', name: 'Chile', flag: '🇨🇱' },
      { code: 'CO', name: 'Colômbia', flag: '🇨🇴' },
      { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
      { code: 'EC', name: 'Equador', flag: '🇪🇨' },
      { code: 'GY', name: 'Guiana', flag: '🇬🇾' },
      { code: 'SR', name: 'Suriname', flag: '🇸🇷' },
      { code: 'GF', name: 'Guiana Francesa', flag: '🇬🇫' }
    ];
  }

  /**
   * Obter formato de endereço por país
   */
  getAddressFormat(country) {
    const formats = {
      BR: {
        fields: ['zipCode', 'street', 'number', 'neighborhood', 'city', 'state'],
        labels: {
          zipCode: 'CEP',
          street: 'Rua/Avenida',
          number: 'Número',
          neighborhood: 'Bairro',
          city: 'Cidade',
          state: 'Estado'
        },
        required: ['zipCode', 'street', 'city', 'state']
      },
      CN: {
        fields: ['province', 'city', 'district', 'street', 'number'],
        labels: {
          province: 'Província',
          city: 'Cidade',
          district: 'Distrito',
          street: 'Rua',
          number: 'Número'
        },
        required: ['province', 'city', 'street']
      },
      US: {
        fields: ['street', 'number', 'city', 'state', 'zipCode'],
        labels: {
          street: 'Street',
          number: 'Number',
          city: 'City',
          state: 'State',
          zipCode: 'ZIP Code'
        },
        required: ['street', 'city', 'state', 'zipCode']
      }
    };

    return formats[country] || formats['US'];
  }
}

export default new AddressValidationService();
