import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, CardContent, CardHeader, 
  Grid, Typography, Box, 
  CircularProgress, Tabs, Tab,
  Paper, Divider, Button,
  FormControl, InputLabel, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Avatar, Chip,
  TextField, IconButton, Tooltip
} from '@mui/material';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, 
  Cell, BarChart, Bar, Legend, LineChart, Line
} from 'recharts';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// Importações de componentes e hooks personalizados
import { useNFTData } from '../../hooks/useNFTData';
import { useNFTStats } from '../../hooks/useNFTStats';
import { useNFTHistory } from '../../hooks/useNFTHistory';
import { useNFTValuation } from '../../hooks/useNFTValuation';
import { useCommodityPrices } from '../../hooks/useCommodityPrices';
import { useWeatherData } from '../../hooks/useWeatherData';
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
  crop?: string; // tipo de cultura, para fazendas e lotes
  quantity?: number; // quantidade, para lotes de grãos
  estimatedValue: number; // em USD
  lastValuation: string; // data
  owner: string;
  tokenId: string;
  metadata: {
    latitude?: number;
    longitude?: number;
    yieldHistory?: Array<{period: string, yield: number}>;
    certifications?: string[];
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
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  
  // Estados
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Hooks personalizados para buscar dados
  const { nfts, totalNFTs, totalValue } = useNFTStats();
  const { nftHistory } = useNFTHistory(timeRange);
  const { recentSales } = useNFTData();
  const { predictedValues } = useNFTValuation();
  const { commodityPrices } = useCommodityPrices();
  
  // Dados processados para visualizações
  const nftDistribution: NFTDistribution[] = useMemo(() => [
    { type: 'Fazendas', count: 120, value: 75000000, percentage: 60 },
    { type: 'Maquinário', count: 350, value: 25000000, percentage: 20 },
    { type: 'Lotes de Grãos', count: 580, value: 15000000, percentage: 12 },
    { type: 'Certificados', count: 450, value: 10000000, percentage: 8 },
  ], []);
  
  // Efeito para simular carregamento de dados
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Manipuladores de eventos
  const handleTimeRangeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTimeRange(event.target.value as '7d' | '30d' | '90d' | '1y');
  };
  
  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
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
    return nfts.filter(nft => {
      const matchesSearch = searchTerm === '' || 
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (nft.crop && nft.crop.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === 'all' || nft.type === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [nfts, searchTerm, selectedType]);
  
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
        <Grid item xs={12} md={3}>
          <NFTMetricsCard 
            title="Total de NFTs" 
            value={totalNFTs.toString()}
            secondaryValue={`${nftDistribution.reduce((acc, item) => acc + item.count, 0)} tokenizados`}
            change={+8.3}
            icon="nft"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <NFTMetricsCard 
            title="Valor Total" 
            value={`$${(totalValue / 1000000).toFixed(2)}M USD`}
            change={+15.7}
            icon="money"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <NFTMetricsCard 
            title="Vendas (30d)" 
            value={recentSales.length.toString()}
            secondaryValue={`$${(recentSales.reduce((acc, sale) => acc + sale.price, 0) / 1000000).toFixed(2)}M USD`}
            change={+22.5}
            icon="sales"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <NFTMetricsCard 
            title="Preço Médio" 
            value={`$${(totalValue / totalNFTs).toLocaleString()} USD`}
            change={+5.2}
            icon="chart"
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
                <AreaChart
                  data={nftHistory}
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
                  <RechartsTooltip 
                    formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M USD`, 'Valor Total']}
                    labelFormatter={(date) => format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="totalValue" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                    name="Valor Total"
                  />
                </AreaChart>
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
                  <RechartsTooltip 
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
                  Exibindo {filteredNFTs.length} de {nfts.length} NFTs
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
                              src={nft.imageUrl} 
                              alt={nft.name} 
                              sx={{ mr: 2, width: 40, height: 40 }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/nft-placeholder.svg';
                              }}
                            />
                            <Typography variant="body2">{nft.name}</Typography>
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
                              {nft.metadata.certifications?.join(', ')}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="bold">
                            ${nft.estimatedValue.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {format(new Date(nft.lastValuation), 'dd/MM/yyyy', { locale: ptBR })}
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
                    <TableContainer sx={{ maxHeight: 300 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>NFT</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell align="right">Preço</TableCell>
                            <TableCell align="right">Data</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {recentSales.map((sale) => (
                            <TableRow key={sale.id} hover>
                              <TableCell>{sale.nftName}</TableCell>
                              <TableCell>{sale.nftType}</TableCell>
                              <TableCell align="right">${sale.price.toLocaleString()}</TableCell>
                              <TableCell align="right">
                                {format(new Date(sale.date), 'dd/MM/yyyy', { locale: ptBR })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
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
                        <RechartsTooltip 
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
                    <NFTMap nfts={nfts} height={400} />
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
                        data={predictedValues}
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
                        <RechartsTooltip 
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