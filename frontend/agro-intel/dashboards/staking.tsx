import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, CardContent, CardHeader, 
  Grid, Typography, Box, 
  CircularProgress, Tabs, Tab,
  Paper, Divider, Button,
  FormControl, InputLabel, Select, MenuItem, SelectChangeEvent
} from '@mui/material';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, 
  Cell, BarChart, Bar, Legend 
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useWeb3 } from '../../contexts/Web3Context';
// import { Connection, PublicKey } from '@solana/web3.js';

// Importações de componentes e hooks personalizados
import { useStakingData } from '../../hooks/useStakingData';
import { useStakingStats } from '../../hooks/useStakingStats';
import { useStakingHistory } from '../../hooks/useStakingHistory';
import { useStakingRewards } from '../../hooks/useStakingRewards';
import { useAgroTokenPrice } from '../../hooks/useAgroTokenPrice';
import { useYieldPrediction } from '../../hooks/useYieldPrediction';
import StakingDistributionMap from '../../components/StakingDistributionMap';
import StakingMetricsCard from '../../components/StakingMetricsCard';
import { exportToPDF } from '../reports/pdf-export';

// Cores para gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// Tipos
interface StakingPool {
  id: string;
  name: string;
  totalStaked: number;
  stakersCount: number;
  apy: number;
  lockupPeriod: number; // em dias
  minStake: number;
}

interface StakingHistoryItem {
  date: string;
  totalStaked: number;
  newStakers: number;
  unstaked: number;
  apy: number;
}

interface StakingDistribution {
  region: string;
  value: number;
  percentage: number;
}

interface StakingByDuration {
  duration: string;
  value: number;
  percentage: number;
}

const StakingDashboard: React.FC = () => {
  
  // Estados
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedPool, setSelectedPool] = useState<string>('all');
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Hooks personalizados para buscar dados
  const { stats, pools } = useStakingStats();
  const { history } = useStakingHistory();
  const { predictions } = useYieldPrediction();
  const { currentPrice } = useAgroTokenPrice();
  
  // Extrair valores das stats
  const { totalStaked, activeStakers } = stats;
  
  // Dados processados para visualizações
  const stakingDistribution: StakingDistribution[] = useMemo(() => [
    { region: 'Sul', value: 3500000, percentage: 35 },
    { region: 'Sudeste', value: 2500000, percentage: 25 },
    { region: 'Centro-Oeste', value: 2000000, percentage: 20 },
    { region: 'Nordeste', value: 1500000, percentage: 15 },
    { region: 'Norte', value: 500000, percentage: 5 },
  ], []);
  
  const stakingByDuration: StakingByDuration[] = useMemo(() => [
    { duration: '30 dias', value: 2000000, percentage: 20 },
    { duration: '90 dias', value: 3000000, percentage: 30 },
    { duration: '180 dias', value: 3500000, percentage: 35 },
    { duration: '365 dias', value: 1500000, percentage: 15 },
  ], []);
  
  // Efeito para simular carregamento de dados
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Manipuladores de eventos
  const handleTimeRangeChange = (event: SelectChangeEvent<'7d' | '30d' | '90d' | '1y'>) => {
    setTimeRange(event.target.value as '7d' | '30d' | '90d' | '1y');
  };
  
  const handlePoolChange = (event: SelectChangeEvent<string>) => {
    setSelectedPool(event.target.value as string);
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleExportPDF = () => {
    exportToPDF('staking-dashboard', 'AGROTM - Relatório de Staking');
  };
  
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Carregando dados de staking...</Typography>
      </Box>
    );
  }
  
  return (
    <Box id="staking-dashboard" sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard de Staking
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
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <StakingMetricsCard 
            title="Total em Staking" 
            value={`${(totalStaked / 1000000).toFixed(2)}M AGRO`}
            change={8.5}
            icon="token"
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <StakingMetricsCard 
            title="Total de Stakers" 
            value={activeStakers.toString()}
            change={12.3}
            icon="users"
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <StakingMetricsCard 
            title="APY Médio" 
            value={`${stats.averageAPR.toFixed(2)}%`}
            change={2.1}
            icon="percentage"
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <StakingMetricsCard 
            title="Preço AGRO" 
            value={`$${currentPrice?.price?.toFixed(4) || '0.0000'} USD`}
            change={-1.8}
            icon="price"
          />
        </Grid>
      </Grid>
      
      {/* Gráficos principais */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardHeader 
              title="Evolução do Total em Staking" 
              subheader={`Últimos ${timeRange === '7d' ? '7 dias' : timeRange === '30d' ? '30 dias' : timeRange === '90d' ? '90 dias' : '12 meses'}`}
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={history}
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
                  <Area 
                    type="monotone" 
                    dataKey="totalStaked" 
                    stroke="#8884d8" 
                    fill="#8884d8"
                    fillOpacity={0.3}
                    name="Total em Staking"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Distribuição por Duração" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stakingByDuration}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="duration"
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {stakingByDuration.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${(value / 1000000).toFixed(2)}M AGRO`, 'Valor']}
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
          <Tab label="Pools de Staking" />
          <Tab label="Distribuição Geográfica" />
          <Tab label="Previsão de Rendimentos" />
        </Tabs>
        
        <Box p={3}>
          {/* Conteúdo da aba de Pools */}
          {tabValue === 0 && (
            <>
              <Box mb={3}>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Pool</InputLabel>
                  <Select
                    value={selectedPool}
                    onChange={handlePoolChange}
                    label="Pool"
                  >
                    <MenuItem value="all">Todos os Pools</MenuItem>
                    {pools.map((pool) => (
                      <MenuItem key={pool.id} value={pool.id}>{pool.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              <Grid container spacing={3}>
                {pools
                  .filter(pool => selectedPool === 'all' || pool.id === selectedPool)
                  .map((pool) => (
                    <Grid item xs={12} md={6} lg={4} key={pool.id}>
                      <Card>
                        <CardHeader 
                          title={pool.name} 
                          subheader={`Lockup: ${pool.lockPeriod} dias`}
                        />
                        <CardContent>
                          <Typography variant="h6" color="primary">
                            APY: {pool.apr.toFixed(2)}%
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="body2">
                            Total em Staking: {(pool.totalStaked / 1000000).toFixed(2)}M AGRO
                          </Typography>
                          <Typography variant="body2">
                            Stakers: {Math.floor(pool.totalStaked / 1000)}
                          </Typography>
                          <Typography variant="body2">
                            Stake Mínimo: {Math.floor(pool.totalStaked / 10000).toLocaleString()} AGRO
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                }
              </Grid>
            </>
          )}
          
          {/* Conteúdo da aba de Distribuição Geográfica */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <StakingDistributionMap pools={pools.map((pool, index) => ({
                  id: pool.id,
                  name: pool.name,
                  totalStaked: pool.totalStaked,
                  percentage: (pool.totalStaked / totalStaked) * 100,
                  color: COLORS[index % COLORS.length]
                }))} />
              </Grid>
              <Grid item xs={12} md={5}>
                <Card>
                  <CardHeader title="Distribuição por Região" />
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={stakingDistribution}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                        <YAxis dataKey="region" type="category" />
                        <Tooltip 
                          formatter={(value: number) => [`${(value / 1000000).toFixed(2)}M AGRO`, 'Valor em Staking']}
                        />
                        <Bar dataKey="value" fill="#8884d8">
                          {stakingDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
          
          {/* Conteúdo da aba de Previsão de Rendimentos */}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader 
                    title="Previsão de APY para os Próximos 90 Dias" 
                    subheader="Baseado em dados históricos e fatores externos"
                  />
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart
                        data={predictions}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => format(new Date(date), 'dd/MM', { locale: ptBR })}
                        />
                        <YAxis domain={[0, 'dataMax + 5']} />
                        <Tooltip 
                          labelFormatter={(date) => format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })}
                          formatter={(value: number) => [`${value.toFixed(2)}%`, 'APY Previsto']}
                        />
                        <Legend />
                        {pools.map((pool, index) => (
                          <Area
                            key={pool.id}
                            type="monotone"
                            dataKey={`pool${pool.id}`}
                            name={pool.name}
                            stroke={COLORS[index % COLORS.length]}
                            fill={COLORS[index % COLORS.length]}
                            fillOpacity={0.3}
                          />
                        ))}
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Fatores que Influenciam o APY" />
                  <CardContent>
                    <Typography variant="body1" paragraph>
                      O APY (Rendimento Percentual Anual) dos pools de staking é influenciado por diversos fatores:
                    </Typography>
                    <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                      <li>Preço do token AGRO no mercado</li>
                      <li>Volume de transações na rede</li>
                      <li>Duração do período de lockup</li>
                      <li>Total de tokens em staking</li>
                      <li>Condições climáticas e safra agrícola</li>
                      <li>Preços de commodities agrícolas</li>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Recomendações de Staking" />
                  <CardContent>
                    <Typography variant="body2" paragraph>
                      Com base nas previsões de APY e análise de mercado, recomendamos:
                    </Typography>
                    <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                      <li><strong>Curto prazo (30 dias):</strong> Pool Flexível para maior liquidez</li>
                      <li><strong>Médio prazo (90 dias):</strong> Pool Safra para melhor equilíbrio entre rendimento e liquidez</li>
                      <li><strong>Longo prazo (180+ dias):</strong> Pool Colheita para maximizar rendimentos</li>
                    </Typography>
                    <Typography variant="body2" mt={2}>
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

export default StakingDashboard;