import { useState, useEffect, useCallback } from 'react'

interface Location {
  latitude: number
  longitude: number
  accuracy?: number
  timestamp: number
}

interface RegionInfo {
  region: string
  state: string
  city: string
  country: string
}

interface UseGeolocationReturn {
  location: Location | null
  regionInfo: RegionInfo | null
  loading: boolean
  error: string | null
  getUserLocation: () => void
  clearLocation: () => void
}

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<Location | null>(null)
  const [regionInfo, setRegionInfo] = useState<RegionInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Função para obter localização do usuário
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada neste navegador')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newLocation: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        }

        setLocation(newLocation)

        try {
          // Obter informações da região baseada nas coordenadas
          const regionData = await getRegionFromCoordinates(
            newLocation.latitude,
            newLocation.longitude
          )
          setRegionInfo(regionData)
        } catch (err) {
          console.warn('Erro ao obter informações da região:', err)
          // Definir região padrão baseada nas coordenadas
          const defaultRegion = getDefaultRegionFromCoordinates(
            newLocation.latitude,
            newLocation.longitude
          )
          setRegionInfo(defaultRegion)
        }

        setLoading(false)
      },
      (error) => {
        let errorMessage = 'Erro ao obter localização'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informações de localização indisponíveis'
            break
          case error.TIMEOUT:
            errorMessage = 'Tempo limite para obter localização'
            break
          default:
            errorMessage = 'Erro desconhecido na geolocalização'
        }

        setError(errorMessage)
        setLoading(false)
        
        // Definir localização padrão (São Paulo) em caso de erro
        const defaultLocation: Location = {
          latitude: -23.5505,
          longitude: -46.6333,
          timestamp: Date.now(),
        }
        setLocation(defaultLocation)
        setRegionInfo({
          region: 'Sudeste',
          state: 'SP',
          city: 'São Paulo',
          country: 'Brasil',
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000, // 5 minutos
      }
    )
  }, [])

  // Função para limpar localização
  const clearLocation = useCallback(() => {
    setLocation(null)
    setRegionInfo(null)
    setError(null)
  }, [])

  // Função para obter região baseada nas coordenadas usando API de geocodificação
  const getRegionFromCoordinates = async (
    lat: number,
    lng: number
  ): Promise<RegionInfo> => {
    try {
      // Usar OpenStreetMap Nominatim API (gratuita)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&accept-language=pt-BR`
      )
      
      if (!response.ok) {
        throw new Error('Erro na API de geocodificação')
      }

      const data = await response.json()
      const address = data.address

      // Mapear para regiões brasileiras
      const regionMapping: Record<string, string> = {
        'São Paulo': 'Sudeste',
        'Rio de Janeiro': 'Sudeste',
        'Minas Gerais': 'Sudeste',
        'Espírito Santo': 'Sudeste',
        'Paraná': 'Sul',
        'Santa Catarina': 'Sul',
        'Rio Grande do Sul': 'Sul',
        'Bahia': 'Nordeste',
        'Pernambuco': 'Nordeste',
        'Ceará': 'Nordeste',
        'Maranhão': 'Nordeste',
        'Paraíba': 'Nordeste',
        'Rio Grande do Norte': 'Nordeste',
        'Alagoas': 'Nordeste',
        'Sergipe': 'Nordeste',
        'Piauí': 'Nordeste',
        'Goiás': 'Centro-Oeste',
        'Mato Grosso': 'Centro-Oeste',
        'Mato Grosso do Sul': 'Centro-Oeste',
        'Distrito Federal': 'Centro-Oeste',
        'Pará': 'Norte',
        'Amazonas': 'Norte',
        'Rondônia': 'Norte',
        'Roraima': 'Norte',
        'Amapá': 'Norte',
        'Tocantins': 'Norte',
        'Acre': 'Norte',
      }

      const state = address.state || address.province || 'SP'
      const city = address.city || address.town || address.village || 'São Paulo'
      const region = regionMapping[state] || 'Sudeste'

      return {
        region,
        state,
        city,
        country: address.country || 'Brasil',
      }
    } catch (error) {
      console.error('Erro ao obter região:', error)
      throw error
    }
  }

  // Função para obter região padrão baseada nas coordenadas (fallback)
  const getDefaultRegionFromCoordinates = (
    lat: number,
    lng: number
  ): RegionInfo => {
    // Mapeamento básico de coordenadas para regiões brasileiras
    if (lat >= -23.5 && lat <= -15.5 && lng >= -48.0 && lng <= -38.0) {
      return { region: 'Sudeste', state: 'SP', city: 'São Paulo', country: 'Brasil' }
    }
    if (lat >= -23.0 && lat <= -20.0 && lng >= -44.0 && lng <= -40.0) {
      return { region: 'Sudeste', state: 'RJ', city: 'Rio de Janeiro', country: 'Brasil' }
    }
    if (lat >= -20.0 && lat <= -15.0 && lng >= -48.0 && lng <= -42.0) {
      return { region: 'Sudeste', state: 'MG', city: 'Belo Horizonte', country: 'Brasil' }
    }
    if (lat >= -25.5 && lat <= -22.5 && lng >= -54.0 && lng <= -48.0) {
      return { region: 'Sul', state: 'PR', city: 'Curitiba', country: 'Brasil' }
    }
    if (lat >= -27.5 && lat <= -25.5 && lng >= -54.0 && lng <= -48.0) {
      return { region: 'Sul', state: 'SC', city: 'Florianópolis', country: 'Brasil' }
    }
    if (lat >= -30.5 && lat <= -27.5 && lng >= -54.0 && lng <= -48.0) {
      return { region: 'Sul', state: 'RS', city: 'Porto Alegre', country: 'Brasil' }
    }
    if (lat >= -13.0 && lat <= -8.0 && lng >= -42.0 && lng <= -34.0) {
      return { region: 'Nordeste', state: 'BA', city: 'Salvador', country: 'Brasil' }
    }
    if (lat >= -8.0 && lat <= -3.0 && lng >= -38.0 && lng <= -32.0) {
      return { region: 'Nordeste', state: 'PE', city: 'Recife', country: 'Brasil' }
    }
    if (lat >= -16.0 && lat <= -12.0 && lng >= -60.0 && lng <= -50.0) {
      return { region: 'Centro-Oeste', state: 'MT', city: 'Cuiabá', country: 'Brasil' }
    }
    if (lat >= -16.0 && lat <= -14.0 && lng >= -49.0 && lng <= -46.0) {
      return { region: 'Centro-Oeste', state: 'GO', city: 'Goiânia', country: 'Brasil' }
    }
    if (lat >= -4.0 && lat <= 2.0 && lng >= -70.0 && lng <= -60.0) {
      return { region: 'Norte', state: 'AM', city: 'Manaus', country: 'Brasil' }
    }

    // Padrão para São Paulo
    return { region: 'Sudeste', state: 'SP', city: 'São Paulo', country: 'Brasil' }
  }

  // Obter localização automaticamente ao montar o componente
  useEffect(() => {
    getUserLocation()
  }, [getUserLocation])

  return {
    location,
    regionInfo,
    loading,
    error,
    getUserLocation,
    clearLocation,
  }
}
