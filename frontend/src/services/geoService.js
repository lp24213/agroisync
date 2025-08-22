import { useState, useEffect, useCallback } from 'react';

// Hook para geolocalização com GPS + fallback IP
export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [regionInfo, setRegionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para obter localização por IP (fallback)
  const getLocationByIP = useCallback(async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      const ipLocation = {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        state: data.region,
        country: data.country_name,
        countryCode: data.country_code
      };
      
      setLocation({
        coords: {
          latitude: data.latitude,
          longitude: data.longitude
        }
      });
      
      setRegionInfo(ipLocation);
      return ipLocation;
    } catch (error) {
      throw new Error('Erro ao obter localização por IP: ' + error.message);
    }
  }, []);

  // Função para reverse geocoding (coordenadas -> endereço)
  const reverseGeocode = useCallback(async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );
      const data = await response.json();
      
      const address = data.address;
      return {
        latitude,
        longitude,
        city: address.city || address.town || address.village || 'Desconhecida',
        state: address.state || address.region || 'Desconhecido',
        country: address.country || 'Brasil',
        countryCode: address.country_code || 'br'
      };
    } catch (error) {
      throw new Error('Erro no reverse geocoding: ' + error.message);
    }
  }, []);

  // Função para obter localização GPS
  const getGPSLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada pelo navegador'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            setLocation(position);
            const regionData = await reverseGeocode(
              position.coords.latitude,
              position.coords.longitude
            );
            setRegionInfo(regionData);
            resolve(regionData);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          let errorMessage = 'Erro ao obter localização GPS';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permissão negada para acessar localização';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Localização indisponível';
              break;
            case error.TIMEOUT:
              errorMessage = 'Timeout ao obter localização';
              break;
            default:
              errorMessage = 'Erro desconhecido ao obter localização';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        }
      );
    });
  }, [reverseGeocode]);

  // Efeito principal para obter localização
  useEffect(() => {
    const initializeLocation = async () => {
      setLoading(true);
      setError(null);

      try {
        // Tenta GPS primeiro
        try {
          await getGPSLocation();
        } catch (gpsError) {
          console.warn('GPS falhou, usando fallback IP:', gpsError.message);
          // Fallback para IP
          await getLocationByIP();
        }
      } catch (error) {
        console.error('Erro ao obter localização:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeLocation();
  }, [getGPSLocation, getLocationByIP]);

  const refreshLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      await getGPSLocation();
    } catch (gpsError) {
      try {
        await getLocationByIP();
      } catch (ipError) {
        setError('Não foi possível obter localização: ' + ipError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    regionInfo,
    loading,
    error,
    refreshLocation
  };
};
