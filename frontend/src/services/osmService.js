/**
 * 🗺️ OPENSTREETMAP SERVICE
 * Serviço de geolocalização, rotas e distâncias usando OSM
 * Totalmente GRATUITO e sem limites!
 */

// APIs OpenStreetMap
const NOMINATIM_API = 'https://nominatim.openstreetmap.org';
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';
const OSRM_API = 'https://router.project-osrm.org';

// ========================================
// GEOCODING (Endereço → Coordenadas)
// ========================================

/**
 * Converte endereço em coordenadas usando Nominatim
 * @param {String} address - Endereço (ex: "São Paulo, SP")
 * @returns {Promise<Object>} { lat, lng, formatted }
 */
export const geocode = async (address) => {
  try {
    const url = `${NOMINATIM_API}/search?` + new URLSearchParams({
      q: address,
      format: 'json',
      addressdetails: 1,
      limit: 1,
      countrycodes: 'br' // Somente Brasil
    });

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AgroSync/1.0 (agroisync.com)' // OSM requer User-Agent
      }
    });

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return {
        success: true,
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        formatted: result.display_name,
        city: result.address?.city || result.address?.town || result.address?.village,
        state: result.address?.state,
        country: result.address?.country,
        boundingbox: result.boundingbox
      };
    }

    return {
      success: false,
      error: 'Endereço não encontrado'
    };

  } catch (error) {
    console.error('OSM Geocoding error:', error);
    return {
      success: false,
      error: 'Erro ao geocodificar endereço'
    };
  }
};

/**
 * Converte coordenadas em endereço usando Reverse Geocoding
 * @param {Number} lat - Latitude
 * @param {Number} lng - Longitude
 * @returns {Promise<Object>} { address, city, state }
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    const url = `${NOMINATIM_API}/reverse?` + new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      format: 'json',
      addressdetails: 1
    });

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AgroSync/1.0 (agroisync.com)'
      }
    });

    const data = await response.json();

    if (data && data.address) {
      return {
        success: true,
        address: data.display_name,
        city: data.address.city || data.address.town || data.address.village,
        state: data.address.state,
        country: data.address.country,
        postcode: data.address.postcode
      };
    }

    return {
      success: false,
      error: 'Coordenadas não encontradas'
    };

  } catch (error) {
    console.error('OSM Reverse Geocoding error:', error);
    return {
      success: false,
      error: 'Erro ao converter coordenadas'
    };
  }
};

// ========================================
// ROUTING (Rotas e Distâncias)
// ========================================

/**
 * Calcula rota entre dois pontos usando OSRM
 * @param {String|Object} origin - Origem (endereço ou {lat, lng})
 * @param {String|Object} destination - Destino (endereço ou {lat, lng})
 * @param {Object} options - Opções de rota
 * @returns {Promise<Object>} Rota completa
 */
export const getRoute = async (origin, destination, options = {}) => {
  try {
    // Geocodificar se necessário
    let originCoords = origin;
    let destCoords = destination;

    if (typeof origin === 'string') {
      const geocoded = await geocode(origin);
      if (!geocoded.success) throw new Error('Origem não encontrada');
      originCoords = { lat: geocoded.lat, lng: geocoded.lng };
    }

    if (typeof destination === 'string') {
      const geocoded = await geocode(destination);
      if (!geocoded.success) throw new Error('Destino não encontrado');
      destCoords = { lat: geocoded.lat, lng: geocoded.lng };
    }

    // Construir URL da rota
    const profile = options.profile || 'driving'; // driving, cycling, walking
    const url = `${OSRM_API}/route/v1/${profile}/${originCoords.lng},${originCoords.lat};${destCoords.lng},${destCoords.lat}?` +
      new URLSearchParams({
        overview: 'full',
        geometries: 'geojson',
        steps: 'true',
        alternatives: options.alternatives !== false ? 'true' : 'false'
      });

    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== 'Ok') {
      throw new Error('Erro ao calcular rota');
    }

    const route = data.routes[0];

    // Calcular custos estimados
    const distanceKm = route.distance / 1000;
    const tollsEstimate = Math.floor(distanceKm / 150) * 12.50; // Pedágio a cada 150km
    const fuelConsumption = distanceKm / 4; // 4 km/L para caminhão
    const fuelCost = fuelConsumption * 6.20; // R$ 6,20/L

    return {
      success: true,
      distance: {
        value: route.distance, // metros
        text: `${distanceKm.toFixed(1)} km`
      },
      duration: {
        value: route.duration, // segundos
        text: formatDuration(route.duration)
      },
      geometry: route.geometry,
      steps: route.legs[0].steps.map(step => ({
        distance: step.distance,
        duration: step.duration,
        instruction: step.maneuver.instruction || 'Continue',
        location: step.maneuver.location
      })),
      alternatives: data.routes.slice(1).map(alt => ({
        distance: {
          value: alt.distance,
          text: `${(alt.distance / 1000).toFixed(1)} km`
        },
        duration: {
          value: alt.duration,
          text: formatDuration(alt.duration)
        }
      })),
      estimates: {
        tolls: tollsEstimate.toFixed(2),
        fuelCost: fuelCost.toFixed(2),
        fuelLiters: fuelConsumption.toFixed(2)
      }
    };

  } catch (error) {
    console.error('OSM Routing error:', error);
    return {
      success: false,
      error: 'Erro ao calcular rota'
    };
  }
};

/**
 * Calcula apenas distância e duração (mais rápido)
 * @param {String|Object} origin - Origem
 * @param {String|Object} destination - Destino
 * @returns {Promise<Object>} Distância e duração
 */
export const getDistanceMatrix = async (origin, destination) => {
  try {
    const route = await getRoute(origin, destination, { alternatives: false });
    
    if (!route.success) {
      throw new Error('Erro ao calcular distância');
    }

    return {
      success: true,
      origin: typeof origin === 'string' ? origin : 'Origem',
      destination: typeof destination === 'string' ? destination : 'Destino',
      distance: route.distance,
      duration: route.duration,
      estimates: route.estimates
    };

  } catch (error) {
    console.error('OSM Distance Matrix error:', error);
    return {
      success: false,
      error: 'Erro ao calcular distância'
    };
  }
};

// ========================================
// AUTOCOMPLETE (Sugestões de Endereço)
// ========================================

/**
 * Autocomplete de endereços usando Nominatim
 * @param {String} input - Texto digitado
 * @returns {Promise<Array>} Sugestões
 */
export const autocomplete = async (input) => {
  try {
    if (!input || input.length < 3) {
      return { success: true, predictions: [] };
    }

    const url = `${NOMINATIM_API}/search?` + new URLSearchParams({
      q: input,
      format: 'json',
      addressdetails: 1,
      limit: 5,
      countrycodes: 'br'
    });

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AgroSync/1.0 (agroisync.com)'
      }
    });

    const data = await response.json();

    const predictions = data.map((item, index) => ({
      place_id: item.place_id || `osm_${index}`,
      description: item.display_name,
      structured_formatting: {
        main_text: item.address?.city || item.address?.town || item.address?.village || item.name,
        secondary_text: `${item.address?.state || ''}, ${item.address?.country || 'Brasil'}`
      },
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon)
    }));

    return {
      success: true,
      predictions
    };

  } catch (error) {
    console.error('OSM Autocomplete error:', error);
    return {
      success: false,
      error: 'Erro no autocomplete'
    };
  }
};

// ========================================
// SEARCH NEARBY (Buscar Pontos de Interesse)
// ========================================

/**
 * Busca pontos de interesse próximos
 * @param {Number} lat - Latitude
 * @param {Number} lng - Longitude
 * @param {String} type - Tipo (gas_station, restaurant, hotel, etc)
 * @param {Number} radius - Raio em metros (padrão: 5000)
 * @returns {Promise<Array>} Pontos encontrados
 */
export const searchNearby = async (lat, lng, type = 'amenity', radius = 5000) => {
  try {
    // Converter raio para graus (aproximadamente)
    const radiusDegrees = radius / 111000;

    const query = `
      [out:json][timeout:25];
      (
        node["${type}"](around:${radius},${lat},${lng});
        way["${type}"](around:${radius},${lat},${lng});
      );
      out center 10;
    `;

    const response = await fetch(OVERPASS_API, {
      method: 'POST',
      body: query
    });

    const data = await response.json();

    const places = data.elements.map(element => ({
      id: element.id,
      name: element.tags?.name || 'Sem nome',
      type: element.tags?.[type] || type,
      lat: element.lat || element.center?.lat,
      lng: element.lon || element.center?.lon,
      tags: element.tags
    }));

    return {
      success: true,
      places
    };

  } catch (error) {
    console.error('OSM Search Nearby error:', error);
    return {
      success: false,
      error: 'Erro ao buscar pontos próximos'
    };
  }
};

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

/**
 * Formata duração em segundos para texto legível
 */
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
}

/**
 * Calcula distância entre dois pontos (Haversine)
 */
export function calculateDistance(point1, point2) {
  const R = 6371; // Raio da Terra em km
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lng - point1.lng);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Cache simples para reduzir requisições
 */
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

function getCached(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCache(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

// Wrapper com cache para geocode
const geocodeOriginal = geocode;
export const geocodeCached = async (address) => {
  const cacheKey = `geocode_${address}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;
  
  const result = await geocodeOriginal(address);
  if (result.success) {
    setCache(cacheKey, result);
  }
  return result;
};

// ========================================
// EXPORT DEFAULT
// ========================================

const OSMService = {
  geocode,
  geocodeCached,
  reverseGeocode,
  getRoute,
  getDistanceMatrix,
  autocomplete,
  searchNearby,
  calculateDistance
};

export default OSMService;

