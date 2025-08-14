import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, CardHeader,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, FormControl, InputLabel, Select, MenuItem,
  Tabs, Tab, TextField, Avatar, Chip, CircularProgress,
  SelectChangeEvent
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useWeb3 } from '../../contexts/Web3Context';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// Hooks e componentes personalizados
import useNFTStats from '../../hooks/useNFTStats';
import useNFTHistory from '../../hooks/useNFTHistory';
import useNFTData from '../../hooks/useNFTData';
import useNFTValuation from '../../hooks/useNFTValuation';
import useCommodityPrices from '../../hooks/useCommodityPrices';
import useWeatherData from '../../hooks/useWeatherData';
import NFTMetricsCard from '../../components/NFTMetricsCard';
import NFTMap from '../../components/NFTMap';
import { exportToPDF } from '../reports/pdf-export';

// Cores para gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// Tipos
interface NFT {
  id: string;
  name: string;
  imageUrl: string;
  type: 'Fazenda' | 'Maquinário' | 'Lote de Grãos' | 'Certificado';
  location: string;
  area?: number; // em hectares, para fazendas
  crop?: string | null; // tipo de cultura, para fazendas e lotes
  quantity?: number; // quantidade, para lotes de grãos
  estimatedValue: number; // em USD
  lastValuation: string; // data
  owner: string;
  tokenId: string;
  // Propriedades necessárias para o NFTMap
  latitude: number;
  longitude: number;
  status: 'active' | 'pending' | 'sold';
  metadata: {
    latitude?: number;
    longitude?: number;
    yieldHistory?: Array<{period: string, yield: number}>;
    certifications?: string[];
    description?: string; // Added for mock data
    [key: string]: any;
  };
}

interface NFTSale {
  id: string;
  nftId: string;
  nftName: string;
  nftType: string;
  price: number; // em USD
  date: string;
  buyer: string;
  seller: string;
}

interface NFTValuationHistory {
  date: string;
  averageValue: number; // em USD
  totalValue: number; // em USD
  farmValue: number; // em USD
  machineryValue: number; // em USD
  grainLotsValue: number; // em USD
  certificatesValue: number; // em USD
}

interface NFTDistribution {
  type: string;
  count: number;
  value: number;
  percentage: number;
}

const NFTDashboard: React.FC = () => {
  
  // Estados
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Hooks personalizados para buscar dados
  const { stats, collections, loading: statsLoading } = useNFTStats();
  const { valuationHistory } = useNFTHistory();
  const { nfts: nftData } = useNFTData();
  const { valuations } = useNFTValuation();
  const { prices: commodityPrices } = useCommodityPrices();
  const { currentWeather: weatherData } = useWeatherData();
  
  // Extrair valores das stats
  const { totalNFTs, totalValue } = stats;
  
  // Dados mock para NFTs (em produção viriam da API)
  const mockNFTs = useMemo(() => [
    {
      id: '1',
      name: 'Fazenda Santa Maria',
      type: 'Fazenda' as const,
      location: 'Goiás, Brasil',
      crop: 'Soja',
      value: 50000,
      estimatedValue: 50000,
      lastValuation: '2024-12-15',
      mintDate: new Date('2024-01-15'),
      image: '/images/farm1.jpg',
      imageUrl: '/images/farm1.jpg',
      area: 1500,
      tokenId: 'token_001',
      quantity: 1,
      metadata: { description: 'Fazenda de soja premium' },
      owner: '0x1234...5678',
      // Propriedades necessárias para o NFTMap
      latitude: -16.6864,
      longitude: -49.2653,
      status: 'active' as const
    },
    {
      id: '2',
      name: 'Trator John Deere 5075E',
      type: 'Maquinário' as const,
      location: 'Mato Grosso, Brasil',
      crop: null,
      value: 15000,
      estimatedValue: 15000,
      lastValuation: '2024-12-14',
      mintDate: new Date('2024-02-20'),
      image: '/images/tractor1.jpg',
      imageUrl: '/images/tractor1.jpg',
      area: 0,
      tokenId: 'token_002',
      quantity: 1,
      metadata: { description: 'Trator agrícola profissional' },
      owner: '0x8765...4321',
      // Propriedades necessárias para o NFTMap
      latitude: -15.6014,
      longitude: -56.0979,
      status: 'active' as const
    },
    {
      id: '3',
      name: 'Lote de Soja Premium',
      type: 'Lote de Grãos' as const,
      location: 'Paraná, Brasil',
      crop: 'Soja',
      value: 8000,
      estimatedValue: 8000,
      lastValuation: '2024-12-13',
      mintDate: new Date('2024-03-10'),
      image: '/images/soybean1.jpg',
      imageUrl: '/images/soybean1.jpg',
      area: 100,
      tokenId: 'token_003',
      quantity: 500,
      metadata: { description: 'Lote de soja de alta qualidade' },
      owner: '0x9876...5432',
      // Propriedades necessárias para o NFTMap
      latitude: -25.4289,
      longitude: -49.2671,
      status: 'active' as const
    },
    {
      id: '4',
      name: 'Certificado de Sustentabilidade',
      type: 'Certificado' as const,
      location: 'São Paulo, Brasil',
      crop: null,
      value: 2500,
      estimatedValue: 2500,
      lastValuation: '2024-12-12',
      mintDate: new Date('2024-04-05'),
      image: '/images/certificate1.jpg',
      imageUrl: '/images/certificate1.jpg',
      area: 0,
      tokenId: 'token_004',
      quantity: 1,
      metadata: { description: 'Certificado de práticas sustentáveis' },
      owner: '0x5555...9999',
      // Propriedades necessárias para o NFTMap
      latitude: -23.5505,
      longitude: -46.6333,
      status: 'active' as const
    }
  ], []);
  
  // Dados mock para distribuição (em produção viriam da API)
  const nftDistribution = useMemo(() => [
    { type: 'Fazendas', count: 120, value: 75000000, percentage: 60 },
    { type: 'Maquinário', count: 350, value: 25000000, percentage: 20 },
    { type: 'Lotes de Grãos', count: 580, value: 15000000, percentage: 12 },
    { type: 'Certificados', count: 450, value: 10000000, percentage: 8 },
  ], []);
  
  // Dados mock para vendas recentes
  const recentSales = useMemo(() => [
    { id: '1', nftName: 'Fazenda Santa Maria', price: 50000, date: '2024-01-15' },
    { id: '2', nftName: 'Trator John Deere', price: 15000, date: '2024-02-20' },
    { id: '3', nftName: 'Lote de Soja', price: 8000, date: '2024-03-10' }
  ], []);
  
  // Efeito para simular carregamento de dados
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Manipuladores de eventos
  const handleTimeRangeChange = (event: SelectChangeEvent<string>) => {
    setTimeRange(event.target.value as '7d' | '30d' | '90d' | '1y');
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedType(event.target.value as string);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  const handleExportPDF = () => {
    exportToPDF('nft-dashboard', 'AGROTM - Relatório de NFTs Agrícolas');
  };
  
  // Filtragem de NFTs com base na pesquisa
  const filteredNFTs = useMemo(() => {
    return mockNFTs.filter(nft => {
      const matchesSearch = searchTerm === '' || 
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (nft.crop && nft.crop.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === 'all' || nft.type === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [mockNFTs, searchTerm, selectedType]);
  
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Carregando dados de NFTs agrícolas...</Typography>
      </Box>
    );
  }
  
  return (
    <Box id="nft-dashboard" sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard de NFTs Agrícolas
        </Typography>
        
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleExportPDF}
            sx={{ mr: 2 }}
          >
            Exportar PDF
          </Button>
          
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Período</InputLabel>
            <Select
              value={timeRange}
              onChange={handleTimeRangeChange}
              label="Período"
            >
              <MenuItem value="7d">7 dias</MenuItem>
              <MenuItem value="30d">30 dias</MenuItem>
              <MenuItem value="90d">90 dias</MenuItem>
              <MenuItem value="1y">1 ano</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      {/* Cards de métricas principais */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <NFTMetricsCard
            title="Total de NFTs"
            value={totalNFTs.toLocaleString()}
            change={12.5}
            icon="nft"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <NFTMetricsCard
            title="Valor Total"
            value={`$${totalValue.toLocaleString()}`}
            change={8.2}
            icon="currency"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <NFTMetricsCard
            title="Valor Médio"
            value={`$${Math.round(totalValue / totalNFTs).toLocaleString()}`}
            change={-2.1}
            icon="chart"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <NFTMetricsCard
            title="Novos Mints"
            value={stats.recentMints.toString()}
            change={15.3}
            icon="mint"
          />
        </Grid>
      </Grid>
      
      {/* Gráficos principais */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardHeader 
              title="Evolução do Valor Total de NFTs" 
              subheader={`Últimos ${timeRange === '7d' ? '7 dias' : timeRange === '30d' ? '30 dias' : timeRange === '90d' ? '90 dias' : '12 meses'}`}
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={valuationHistory}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date: string) => format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date: string) => format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalValue" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Valor Total"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Distribuição por Tipo" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={nftDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="type"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {nftDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M USD`, 'Valor']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Abas para diferentes visualizações */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Catálogo de NFTs" />
          <Tab label="Análise de Mercado" />
          <Tab label="Previsão de Valorização" />
        </Tabs>
        
        <Box p={3}>
          {/* Conteúdo da aba de Catálogo */}
          {tabValue === 0 && (
            <>
              <Box mb={3} display="flex" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 200, mr: 2 }}>
                    <InputLabel>Tipo de NFT</InputLabel>
                    <Select
                      value={selectedType}
                      onChange={handleTypeChange}
                      label="Tipo de NFT"
                    >
                      <MenuItem value="all">Todos os Tipos</MenuItem>
                      <MenuItem value="Fazenda">Fazendas</MenuItem>
                      <MenuItem value="Maquinário">Maquinário</MenuItem>
                      <MenuItem value="Lote de Grãos">Lotes de Grãos</MenuItem>
                      <MenuItem value="Certificado">Certificados</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Buscar NFTs..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  Exibindo {filteredNFTs.length} de {mockNFTs.length} NFTs
                </Typography>
              </Box>
              
              <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>NFT</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Localização</TableCell>
                      <TableCell>Detalhes</TableCell>
                      <TableCell align="right">Valor Estimado</TableCell>
                      <TableCell align="right">Última Avaliação</TableCell>
                      <TableCell align="right">Proprietário</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredNFTs.map((nft) => (
                      <TableRow key={nft.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar 
                              src={nft.image} 
                              alt={nft.name} 
                              sx={{ mr: 2, width: 40, height: 40 }}
                            />
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {nft.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {nft.type} • {nft.location}
                              </Typography>
                              {nft.crop && (
                                <Chip 
                                  label={nft.crop} 
                                  size="small" 
                                  color="primary" 
                                  sx={{ mt: 0.5 }}
                                />
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={nft.type} 
                            size="small" 
                            color={
                              nft.type === 'Fazenda' ? 'success' :
                              nft.type === 'Maquinário' ? 'primary' :
                              nft.type === 'Lote de Grãos' ? 'warning' :
                              'secondary'
                            } 
                            variant="outlined" 
                          />
                        </TableCell>
                        <TableCell>{nft.location}</TableCell>
                        <TableCell>
                          {nft.type === 'Fazenda' && (
                            <Typography variant="body2">
                              {nft.area} hectares • {nft.crop}
                            </Typography>
                          )}
                          {nft.type === 'Lote de Grãos' && (
                            <Typography variant="body2">
                              {nft.quantity} toneladas • {nft.crop}
                            </Typography>
                          )}
                          {nft.type === 'Maquinário' && (
                            <Typography variant="body2">
                              ID: {nft.tokenId.substring(0, 8)}...
                            </Typography>
                          )}
                          {nft.type === 'Certificado' && (
                            <Typography variant="body2">
                              {nft.metadata.description}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold">
                            ${nft.value.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {format(new Date(nft.mintDate), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {nft.owner.substring(0, 6)}...{nft.owner.substring(nft.owner.length - 4)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          
          {/* Conteúdo da aba de Análise de Mercado */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Vendas Recentes" />
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={recentSales}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date: string) => format(new Date(date), 'dd/MM', { locale: ptBR })}
                        />
                        <YAxis 
                          tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}K`}
                        />
                        <Tooltip 
                          labelFormatter={(date: string) => format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })}
                          formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, 'Preço']}
                        />
                        <Bar dataKey="price" fill="#8884d8" name="Preço de Venda" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Correlação com Preços de Commodities" />
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={commodityPrices}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => format(new Date(date), 'MM/yyyy', { locale: ptBR })}
                        />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip 
                          labelFormatter={(date) => format(new Date(date), 'MM/yyyy', { locale: ptBR })}
                        />
                        <Legend />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="nftIndex" 
                          name="Índice de Valor de NFTs" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="soybean" 
                          name="Preço da Soja" 
                          stroke="#82ca9d" 
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="corn" 
                          name="Preço do Milho" 
                          stroke="#ffc658" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Distribuição Geográfica de NFTs" />
                  <CardContent>
                    <NFTMap nfts={mockNFTs} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
          
          {/* Conteúdo da aba de Previsão de Valorização */}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader 
                    title="Previsão de Valorização para os Próximos 90 Dias" 
                    subheader="Baseado em dados históricos, preços de commodities e fatores climáticos"
                  />
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart
                        data={valuations}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => format(new Date(date), 'dd/MM', { locale: ptBR })}
                        />
                        <YAxis 
                          tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                        />
                        <Tooltip 
                          labelFormatter={(date) => format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })}
                          formatter={(value: number, name) => [
                            `$${(value / 1000000).toFixed(2)}M USD`, 
                            name === 'farmValue' ? 'Fazendas' :
                            name === 'machineryValue' ? 'Maquinário' :
                            name === 'grainLotsValue' ? 'Lotes de Grãos' :
                            name === 'certificatesValue' ? 'Certificados' :
                            'Valor Total'
                          ]}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="farmValue" 
                          name="Fazendas" 
                          stackId="1"
                          stroke={COLORS[0]} 
                          fill={COLORS[0]} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="machineryValue" 
                          name="Maquinário" 
                          stackId="1"
                          stroke={COLORS[1]} 
                          fill={COLORS[1]} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="grainLotsValue" 
                          name="Lotes de Grãos" 
                          stackId="1"
                          stroke={COLORS[2]} 
                          fill={COLORS[2]} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="certificatesValue" 
                          name="Certificados" 
                          stackId="1"
                          stroke={COLORS[3]} 
                          fill={COLORS[3]} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Fatores que Influenciam a Valorização" />
                  <CardContent>
                    <Typography variant="body1" paragraph>
                      O valor dos NFTs agrícolas é influenciado por diversos fatores:
                    </Typography>
                    <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                      <li>Preços de commodities agrícolas no mercado internacional</li>
                      <li>Condições climáticas e previsões para a safra</li>
                      <li>Localização e infraestrutura das propriedades</li>
                      <li>Certificações e práticas sustentáveis</li>
                      <li>Demanda do mercado por produtos agrícolas</li>
                      <li>Políticas governamentais e subsídios</li>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Oportunidades de Investimento" />
                  <CardContent>
                    <Typography variant="body2" paragraph>
                      Com base nas análises de valorização, identificamos as seguintes oportunidades:
                    </Typography>
                    
                    <Box mb={2}>
                      <Typography variant="subtitle2" display="flex" alignItems="center">
                        <TrendingUpIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                        Alta Valorização Esperada
                      </Typography>
                      <Typography variant="body2" sx={{ pl: 4 }}>
                        Fazendas com cultivo de soja no Centro-Oeste, devido à previsão de aumento nos preços internacionais e condições climáticas favoráveis.
                      </Typography>
                    </Box>
                    
                    <Box mb={2}>
                      <Typography variant="subtitle2" display="flex" alignItems="center">
                        <TrendingUpIcon color="success" fontSize="small" sx={{ mr: 1 }} />
                        Valorização Moderada
                      </Typography>
                      <Typography variant="body2" sx={{ pl: 4 }}>
                        Maquinário agrícola especializado, especialmente para colheita e plantio, devido à crescente demanda por automação.
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" display="flex" alignItems="center">
                        <TrendingDownIcon color="error" fontSize="small" sx={{ mr: 1 }} />
                        Cautela Recomendada
                      </Typography>
                      <Typography variant="body2" sx={{ pl: 4 }}>
                        Lotes de grãos em regiões com previsão de seca ou excesso de chuvas nos próximos meses.
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" mt={2} fontStyle="italic">
                      <strong>Nota:</strong> Estas recomendações são baseadas em modelos preditivos e não garantem resultados futuros.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default NFTDashboard;