class GeolocationService {
  constructor() {
    this.userLocation = null;
    this.isLoading = false;
    this.error = null;
  }

  // Obter localização via IP (geolocalização)
  async getLocationByIP() {
    try {
      this.isLoading = true;
      this.error = null;

      // Usar localização padrão para evitar CORS
      this.userLocation = {
        country: 'Brasil',
        countryCode: 'BR',
        region: 'São Paulo',
        city: 'São Paulo',
        latitude: -23.5505,
        longitude: -46.6333,
        timezone: 'America/Sao_Paulo',
        currency: 'BRL',
        method: 'default'
      };

      return this.userLocation;
    } catch (error) {
      this.error = error.message;
      console.error('Erro ao obter localização por IP:', error);

      // Fallback para localização padrão (Brasil)
      this.userLocation = {
        country: 'Brasil',
        countryCode: 'BR',
        region: 'São Paulo',
        city: 'São Paulo',
        latitude: -23.5505,
        longitude: -46.6333,
        timezone: 'America/Sao_Paulo',
        currency: 'BRL',
        method: 'fallback'
      };

      return this.userLocation;
    } finally {
      this.isLoading = false;
    }
  }

  // Obter localização via GPS (se disponível)
  async getLocationByGPS() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada pelo navegador'));
        return;
      }

      this.isLoading = true;
      this.error = null;

      navigator.geolocation.getCurrentPosition(
        position => {
          this.userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            method: 'gps'
          };

          // Obter informações adicionais baseadas nas coordenadas
          this.reverseGeocode(position.coords.latitude, position.coords.longitude)
            .then(locationInfo => {
              this.userLocation = { ...this.userLocation, ...locationInfo };
              this.isLoading = false;
              resolve(this.userLocation);
            })
            .catch(error => {
              this.isLoading = false;
              resolve(this.userLocation);
            });
        },
        error => {
          this.error = this.getGeolocationErrorMessage(error.code);
          this.isLoading = false;
          reject(new Error(this.error));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        }
      );
    });
  }

  // Geocodificação reversa para obter informações da localização
  async reverseGeocode(lat, lng) {
    // Retornar informações padrão para evitar CORS
    return {
      country: 'Brasil',
      countryCode: 'BR',
      region: 'São Paulo',
      city: 'São Paulo',
      address: 'São Paulo, SP, Brasil'
    };
  }

  // Obter localização (tenta GPS primeiro, depois IP)
  async getLocation() {
    try {
      // Tentar GPS primeiro
      const gpsLocation = await this.getLocationByGPS();
      return gpsLocation;
    } catch (error) {
      console.log('GPS não disponível, tentando IP:', error.message);

      // Fallback para IP
      const ipLocation = await this.getLocationByIP();
      return ipLocation;
    }
  }

  // Obter localização atual (cached ou nova)
  getCurrentLocation() {
    return this.userLocation;
  }

  // Verificar se a localização está disponível
  hasLocation() {
    return this.userLocation !== null;
  }

  // Verificar se está carregando
  isLoading() {
    return this.isLoading;
  }

  // Obter último erro
  getLastError() {
    return this.error;
  }

  // Limpar dados de localização
  clearLocation() {
    this.userLocation = null;
    this.error = null;
  }

  // Obter mensagem de erro da geolocalização
  getGeolocationErrorMessage(code) {
    switch (code) {
      case 1:
        return 'Acesso negado à localização';
      case 2:
        return 'Localização indisponível';
      case 3:
        return 'Tempo limite excedido';
      default:
        return 'Erro desconhecido na geolocalização';
    }
  }

  // Obter distância entre duas coordenadas (fórmula de Haversine)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distância em km

    return distance;
  }

  // Converter graus para radianos
  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // Obter região agrícola baseada na localização
  getAgriculturalRegion() {
    if (!this.userLocation) return null;

    const { country, region } = this.userLocation;

    if (country === 'Brasil') {
      // Mapeamento das principais regiões agrícolas do Brasil
      const agriculturalRegions = {
        'Mato Grosso': 'Centro-Oeste',
        'Mato Grosso do Sul': 'Centro-Oeste',
        Goiás: 'Centro-Oeste',
        'Distrito Federal': 'Centro-Oeste',
        Paraná: 'Sul',
        'Santa Catarina': 'Sul',
        'Rio Grande do Sul': 'Sul',
        'São Paulo': 'Sudeste',
        'Minas Gerais': 'Sudeste',
        'Rio de Janeiro': 'Sudeste',
        'Espírito Santo': 'Sudeste',
        Bahia: 'Nordeste',
        Pernambuco: 'Nordeste',
        Ceará: 'Nordeste',
        Maranhão: 'Nordeste',
        Piauí: 'Nordeste',
        'Rio Grande do Norte': 'Nordeste',
        Paraíba: 'Nordeste',
        Alagoas: 'Nordeste',
        Sergipe: 'Nordeste',
        Pará: 'Norte',
        Amazonas: 'Norte',
        Acre: 'Norte',
        Rondônia: 'Norte',
        Roraima: 'Norte',
        Amapá: 'Norte',
        Tocantins: 'Norte'
      };

      return agriculturalRegions[region] || 'Região não mapeada';
    }

    return 'Internacional';
  }

  // Obter fuso horário local
  getLocalTimezone() {
    if (!this.userLocation) return 'UTC';
    return this.userLocation.timezone || 'UTC';
  }

  // Obter moeda local
  getLocalCurrency() {
    if (!this.userLocation) return 'USD';
    return this.userLocation.currency || 'USD';
  }
}

// Exportar instância singleton
const geolocationService = new GeolocationService();
export default geolocationService;
