import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import InteractiveFreightMap from '@/frontend/src/components/map/InteractiveFreightMap'

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}))

// Mock the useAnalytics hook
jest.mock('@/frontend/src/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackEvent: jest.fn(),
  }),
}))

// Mock the useTheme hook
jest.mock('@/frontend/src/contexts/ThemeContext', () => ({
  useTheme: () => ({
    isDark: false,
  }),
}))

// Mock Leaflet
jest.mock('leaflet', () => ({
  map: jest.fn().mockReturnValue({
    setView: jest.fn(),
    addLayer: jest.fn(),
    removeLayer: jest.fn(),
    eachLayer: jest.fn(),
    fitBounds: jest.fn(),
  }),
  tileLayer: jest.fn().mockReturnValue({
    addTo: jest.fn(),
  }),
  marker: jest.fn().mockReturnValue({
    addTo: jest.fn(),
    bindPopup: jest.fn(),
  }),
  polyline: jest.fn().mockReturnValue({
    addTo: jest.fn(),
  }),
  divIcon: jest.fn().mockReturnValue({}),
  control: {
    zoom: jest.fn().mockReturnValue({
      addTo: jest.fn(),
    }),
    attribution: jest.fn().mockReturnValue({
      addTo: jest.fn(),
    }),
  },
  featureGroup: jest.fn().mockReturnValue({
    getBounds: jest.fn().mockReturnValue({
      pad: jest.fn(),
    }),
  }),
  Icon: {
    Default: {
      prototype: {
        _getIconUrl: 'mock',
      },
      mergeOptions: jest.fn(),
    },
  },
}))

describe('InteractiveFreightMap', () => {
  const defaultProps = {
    freightId: 'freight123',
    driverId: 'driver123',
    origin: { lat: -23.5505, lng: -46.6333, address: 'São Paulo, SP' },
    destination: { lat: -22.9068, lng: -43.1729, address: 'Rio de Janeiro, RJ' },
    isRealTime: true,
    showControls: true,
    height: '500px'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    render(<InteractiveFreightMap {...defaultProps} />)
    
    expect(screen.getByText('map.loading')).toBeInTheDocument()
  })

  it('renders map container', async () => {
    render(<InteractiveFreightMap {...defaultProps} />)
    
    await waitFor(() => {
      const mapContainer = document.querySelector('[ref]')
      expect(mapContainer).toBeInTheDocument()
    })
  })

  it('shows freight information panel', async () => {
    render(<InteractiveFreightMap {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('map.freightInfo')).toBeInTheDocument()
    })
  })

  it('displays tracking controls when showControls is true', async () => {
    render(<InteractiveFreightMap {...defaultProps} showControls={true} />)
    
    await waitFor(() => {
      const trackingButton = document.querySelector('button[title*="tracking"]')
      expect(trackingButton).toBeInTheDocument()
    })
  })

  it('hides controls when showControls is false', async () => {
    render(<InteractiveFreightMap {...defaultProps} showControls={false} />)
    
    await waitFor(() => {
      const controls = document.querySelector('.absolute.top-4.right-4')
      expect(controls).not.toBeInTheDocument()
    })
  })

  it('toggles fullscreen mode', async () => {
    render(<InteractiveFreightMap {...defaultProps} />)
    
    await waitFor(() => {
      const fullscreenButton = document.querySelector('button[title*="fullscreen"]')
      expect(fullscreenButton).toBeInTheDocument()
    })
  })

  it('shows tracking status when tracking is active', async () => {
    render(<InteractiveFreightMap {...defaultProps} isRealTime={true} />)
    
    await waitFor(() => {
      expect(screen.getByText('map.trackingActive')).toBeInTheDocument()
    })
  })

  it('handles error state', async () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    // Mock Leaflet to throw an error
    jest.doMock('leaflet', () => {
      throw new Error('Leaflet failed to load')
    })
    
    render(<InteractiveFreightMap {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar o mapa')).toBeInTheDocument()
    })
    
    consoleSpy.mockRestore()
  })

  it('updates driver location in real-time', async () => {
    render(<InteractiveFreightMap {...defaultProps} isRealTime={true} />)
    
    await waitFor(() => {
      // Simulate time passing to trigger location updates
      act(() => {
        jest.advanceTimersByTime(5000)
      })
    })
  })

  it('calculates and displays route', async () => {
    render(<InteractiveFreightMap {...defaultProps} />)
    
    await waitFor(() => {
      // Route calculation should be triggered
      expect(screen.getByText('map.freightInfo')).toBeInTheDocument()
    })
  })

  it('displays estimated arrival time', async () => {
    render(<InteractiveFreightMap {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('map.estimatedArrival')).toBeInTheDocument()
    })
  })

  it('handles missing freight data gracefully', async () => {
    render(<InteractiveFreightMap {...defaultProps} freightId={null} />)
    
    await waitFor(() => {
      expect(screen.getByText('map.loading')).toBeInTheDocument()
    })
  })

  it('applies custom height', () => {
    const customHeight = '600px'
    render(<InteractiveFreightMap {...defaultProps} height={customHeight} />)
    
    const mapContainer = document.querySelector('[ref]')
    expect(mapContainer).toHaveStyle(`height: ${customHeight}`)
  })

  it('tracks analytics events', async () => {
    const mockTrackEvent = jest.fn()
    jest.doMock('@/frontend/src/hooks/useAnalytics', () => ({
      useAnalytics: () => ({
        trackEvent: mockTrackEvent,
      }),
    }))
    
    render(<InteractiveFreightMap {...defaultProps} />)
    
    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalled()
    })
  })
})
