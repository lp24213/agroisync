import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Card, CardContent, CardHeader, Typography,
  Chip, Avatar, Tooltip, IconButton, Button
} from '@mui/material';
import {
  LocationOn, ZoomIn, ZoomOut, MyLocation,
  FilterList, Info, Directions
} from '@mui/icons-material';

interface NFTLocation {
  id: string;
  name: string;
  type: 'Fazenda' | 'Maquinário' | 'Lote de Grãos' | 'Certificado';
  latitude: number;
  longitude: number;
  value: number;
  area?: number;
  crop?: string | null;
  owner: string;
  status: 'active' | 'pending' | 'sold';
}

interface NFTMapProps {
  nfts: NFTLocation[];
  height?: number;
  showFilters?: boolean;
  onNFTSelect?: (nft: NFTLocation) => void;
}

const NFTMap: React.FC<NFTMapProps> = ({
  nfts,
  height = 400,
  showFilters = true,
  onNFTSelect
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedNFT, setSelectedNFT] = useState<NFTLocation | null>(null);
  const [zoom, setZoom] = useState(10);
  const [center, setCenter] = useState({ lat: -15.7801, lng: -47.9292 }); // Brasília
  const [filterType, setFilterType] = useState<string>('all');
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Simular carregamento do mapa
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filtrar NFTs por tipo
  const filteredNFTs = nfts.filter(nft => 
    filterType === 'all' || nft.type === filterType
  );

  // Calcular centro do mapa baseado nos NFTs
  useEffect(() => {
    if (filteredNFTs.length > 0) {
      const avgLat = filteredNFTs.reduce((sum, nft) => sum + nft.latitude, 0) / filteredNFTs.length;
      const avgLng = filteredNFTs.reduce((sum, nft) => sum + nft.longitude, 0) / filteredNFTs.length;
      setCenter({ lat: avgLat, lng: avgLng });
    }
  }, [filteredNFTs]);

  // Funções de zoom
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 1, 18));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 1, 5));
  const handleResetView = () => {
    setZoom(10);
    if (filteredNFTs.length > 0) {
      const avgLat = filteredNFTs.reduce((sum, nft) => sum + nft.latitude, 0) / filteredNFTs.length;
      const avgLng = filteredNFTs.reduce((sum, nft) => sum + nft.longitude, 0) / filteredNFTs.length;
      setCenter({ lat: avgLat, lng: avgLng });
    }
  };

  // Selecionar NFT
  const handleNFTSelect = (nft: NFTLocation) => {
    setSelectedNFT(nft);
    onNFTSelect?.(nft);
  };

  // Obter cor baseada no tipo
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Fazenda': return '#4caf50';
      case 'Maquinário': return '#2196f3';
      case 'Lote de Grãos': return '#ff9800';
      case 'Certificado': return '#9c27b0';
      default: return '#757575';
    }
  };

  // Obter ícone baseado no tipo
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Fazenda': return '🌾';
      case 'Maquinário': return '🚜';
      case 'Lote de Grãos': return '🌱';
      case 'Certificado': return '📜';
      default: return '📍';
    }
  };

  // Formatar valor
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  // Formatar área
  const formatArea = (area?: number) => {
    if (!area) return 'N/A';
    if (area >= 1000) {
      return `${(area / 1000).toFixed(1)}K ha`;
    }
    return `${area} ha`;
  };

  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardHeader
        title="Localização dos NFTs Agrícolas"
        subheader={`${filteredNFTs.length} NFTs encontrados`}
        action={
          <Box display="flex" gap={1}>
            {showFilters && (
              <Chip
                icon={<FilterList />}
                label={`Filtro: ${filterType === 'all' ? 'Todos' : filterType}`}
                variant="outlined"
                size="small"
                onClick={() => {
                  const types = ['all', 'Fazenda', 'Maquinário', 'Lote de Grãos', 'Certificado'];
                  const currentIndex = types.indexOf(filterType);
                  const nextType = types[(currentIndex + 1) % types.length];
                  setFilterType(nextType);
                }}
              />
            )}
            <IconButton size="small" onClick={handleResetView}>
              <MyLocation />
            </IconButton>
          </Box>
        }
      />

      <CardContent sx={{ p: 0, position: 'relative' }}>
        {/* Controles de zoom */}
        <Box
          position="absolute"
          top={16}
          right={16}
          zIndex={1000}
          display="flex"
          flexDirection="column"
          gap={1}
        >
          <IconButton
            size="small"
            onClick={handleZoomIn}
            sx={{ bgcolor: 'white', boxShadow: 2 }}
          >
            <ZoomIn />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleZoomOut}
            sx={{ bgcolor: 'white', boxShadow: 2 }}
          >
            <ZoomOut />
          </IconButton>
        </Box>

        {/* Área do mapa */}
        <Box
          ref={mapRef}
          sx={{
            height,
            width: '100%',
            bgcolor: '#f5f5f5',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 1
          }}
        >
          {!isMapLoaded ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height="100%"
              gap={2}
            >
              <Typography variant="h6" color="text.secondary">
                Carregando mapa...
              </Typography>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  border: '4px solid #e0e0e0',
                  borderTop: '4px solid #1976d2',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}
              />
            </Box>
          ) : (
            <>
              {/* Mapa simulado com pontos dos NFTs */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)',
                  backgroundImage: `
                    radial-gradient(circle at 20% 30%, #4caf50 1px, transparent 1px),
                    radial-gradient(circle at 80% 70%, #2196f3 1px, transparent 1px),
                    radial-gradient(circle at 40% 80%, #ff9800 1px, transparent 1px)
                  `,
                  backgroundSize: '100px 100px, 150px 150px, 200px 200px'
                }}
              />

              {/* Pontos dos NFTs */}
              {filteredNFTs.map((nft, index) => {
                // Calcular posição relativa no mapa
                const x = ((nft.longitude + 180) / 360) * 100;
                const y = ((90 - nft.latitude) / 180) * 100;
                
                return (
                  <Tooltip
                    key={nft.id}
                    title={
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {nft.name}
                        </Typography>
                        <Typography variant="body2">
                          Tipo: {nft.type}
                        </Typography>
                        <Typography variant="body2">
                          Valor: {formatValue(nft.value)}
                        </Typography>
                        {nft.area && (
                          <Typography variant="body2">
                            Área: {formatArea(nft.area)}
                          </Typography>
                        )}
                        {nft.crop && (
                          <Typography variant="body2">
                            Cultura: {nft.crop}
                          </Typography>
                        )}
                      </Box>
                    }
                    arrow
                    placement="top"
                  >
                    <Box
                      onClick={() => handleNFTSelect(nft)}
                      sx={{
                        position: 'absolute',
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer',
                        zIndex: 100,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translate(-50%, -50%) scale(1.2)',
                          zIndex: 200
                        }
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: getTypeColor(nft.type),
                          width: 32,
                          height: 32,
                          border: '3px solid white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          fontSize: '1rem'
                        }}
                      >
                        {getTypeIcon(nft.type)}
                      </Avatar>
                      
                      {/* Indicador de status */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -2,
                          right: -2,
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: nft.status === 'active' ? '#4caf50' : 
                                   nft.status === 'pending' ? '#ff9800' : '#f44336',
                          border: '2px solid white'
                        }}
                      />
                    </Box>
                  </Tooltip>
                );
              })}

              {/* Informações do zoom */}
              <Box
                position="absolute"
                bottom={16}
                left={16}
                bgcolor="rgba(255,255,255,0.9)"
                px={2}
                py={1}
                borderRadius={1}
                boxShadow={2}
              >
                <Typography variant="caption" color="text.secondary">
                  Zoom: {zoom}x | Centro: {center.lat.toFixed(2)}, {center.lng.toFixed(2)}
                </Typography>
              </Box>
            </>
          )}
        </Box>

        {/* Painel de informações do NFT selecionado */}
        {selectedNFT && (
          <Box
            position="absolute"
            bottom={16}
            right={16}
            bgcolor="white"
            p={2}
            borderRadius={2}
            boxShadow={4}
            maxWidth={300}
            zIndex={1000}
          >
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Avatar
                sx={{
                  bgcolor: getTypeColor(selectedNFT.type),
                  width: 24,
                  height: 24,
                  fontSize: '0.8rem'
                }}
              >
                {getTypeIcon(selectedNFT.type)}
              </Avatar>
              <Typography variant="subtitle2" fontWeight="bold">
                {selectedNFT.name}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" mb={1}>
              {selectedNFT.type} • {formatValue(selectedNFT.value)}
            </Typography>
            
            {selectedNFT.area && (
              <Typography variant="body2" mb={1}>
                Área: {formatArea(selectedNFT.area)}
              </Typography>
            )}
            
            {selectedNFT.crop && (
              <Typography variant="body2" mb={1}>
                Cultura: {selectedNFT.crop}
              </Typography>
            )}
            
            <Box display="flex" gap={1} mt={1}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Info />}
                onClick={() => onNFTSelect?.(selectedNFT)}
              >
                Detalhes
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Directions />}
              >
                Rota
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Card>
  );
};

export default NFTMap;