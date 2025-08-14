import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, CardContent, CardHeader, 
  Grid, Typography, Box, 
  CircularProgress, Tabs, Tab,
  Paper, Divider, Button,
  FormControl, InputLabel, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Avatar, Chip,
  TextField, IconButton, Tooltip,
  List, ListItem, ListItemText, ListItemIcon,
  SelectChangeEvent
} from '@mui/material';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, 
  Cell, BarChart, Bar, Legend, LineChart, Line, Scatter, ScatterChart, ZAxis
} from 'recharts';
import { format, subDays, subMonths, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
// import { useConnection, useWallet } from '@solana/wallet-adapter-react';
// import { Connection, PublicKey } from '@solana/web3.js';

// Ícones
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import PublicIcon from '@mui/icons-material/Public';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SecurityIcon from '@mui/icons-material/Security';
import DownloadIcon from '@mui/icons-material/Download';

// Importações de componentes e hooks personalizados
import { useUserStats } from '../../hooks/useUserStats';
import { useUserActivity } from '../../hooks/useUserActivity';
import { useUserGrowth } from '../../hooks/useUserGrowth';
import { useUserSegmentation } from '../../hooks/useUserSegmentation';
import UserMetricsCard from '../../components/UserMetricsCard';
import UserMap from '../../components/UserMap';
import { exportToPDF } from '../reports/pdf-export';

// Cores para gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// Tipos
interface User {
  id: string;
  walletAddress: string;
  username?: string;
  avatarUrl?: string;
  joinDate: string;
  lastActive: string;
  totalTransactions: number;
  stakingAmount: number;
  nftsOwned: number;
  totalValue: number; // em USD
  kycVerified: boolean;
  role: 'investor' | 'farmer' | 'enterprise' | 'developer' | 'regular';
  country?: string;
  region?: string;
  referredBy?: string;
  referrals: number;
  metadata: {
    devices?: string[];
    preferences?: {
      theme?: 'light' | 'dark';
      notifications?: boolean;
      language?: string;
    };
    [key: string]: any;
  };
}

interface UserActivity {
  date: string;
  transactions: number;
  logins: number;
  stakingActions: number;
  nftActions: number;
  governanceActions: number;
}

interface UserGrowth {
  date: string;
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  retentionRate: number;
}

interface UserSegment {
  segment: string;
  count: number;
  percentage: number;
  avgValue: number;
  growth: number;
}

interface GeoDistribution {
  country: string;
  users: number;
  percentage: number;
}

const UsersDashboard: React.FC = () => {
  // Estados
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Hooks personalizados para buscar dados
  const { stats, activities } = useUserStats();
  const { activities: userActivity } = useUserActivity(timeRange);
  const { data: userGrowth } = useUserGrowth(timeRange);
  const { segments: userSegments } = useUserSegmentation();
  
  // Extrair valores das stats
  const { totalTransactions, totalVolume, nftCount, stakedAmount } = stats;
  
  // Dados mock para usuários (em produção viriam da API)
  const mockUsers = useMemo(() => [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@example.com',
      status: 'active',
      joinDate: '2024-01-15',
      lastActivity: '2024-03-20',
      region: 'São Paulo, SP',
      kycStatus: 'verified',
      totalTransactions: 45,
      totalVolume: 125000
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@example.com',
      status: 'active',
      joinDate: '2024-02-01',
      lastActivity: '2024-03-19',
      region: 'Rio de Janeiro, RJ',
      kycStatus: 'verified',
      totalTransactions: 32,
      totalVolume: 89000
    }
  ], []);
  
  // Dados mock para distribuição geográfica
  const userLocations = useMemo(() => [
    { id: '1', region: 'São Paulo', users: 1250, percentage: 35, color: '#0088FE' },
    { id: '2', region: 'Rio de Janeiro', users: 890, percentage: 25, color: '#00C49F' },
    { id: '3', region: 'Minas Gerais', users: 720, percentage: 20, color: '#FFBB28' },
    { id: '4', region: 'Bahia', users: 450, percentage: 13, color: '#FF8042' },
    { id: '5', region: 'Outros', users: 290, percentage: 7, color: '#8884D8' }
  ], []);
  
  // Efeito para simular carregamento de dados
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Manipuladores de eventos
  const handleTimeRangeChange = (event: SelectChangeEvent<'7d' | '30d' | '90d'>) => {
    setTimeRange(event.target.value as '7d' | '30d' | '90d');
  };
  
  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    setSelectedRole(event.target.value as string);
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  const handleExportPDF = () => {
    exportToPDF('user-dashboard', 'AGROTM - Relatório de Usuários');
  };
  
  // Filtragem de usuários com base na pesquisa e papel
  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      const matchesSearch = searchTerm === '' || 
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.region.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = selectedRole === 'all' || user.status === selectedRole;
      
      return matchesSearch && matchesRole;
    });
  }, [mockUsers, searchTerm, selectedRole]);
  
  // Cálculo de métricas derivadas
  const userGrowthRate = useMemo(() => {
    if (mockUsers.length > 0) {
      return Math.round((mockUsers.filter(u => u.status === 'active').length / mockUsers.length) * 100);
    }
    return 0;
  }, [mockUsers]);

  const retentionRate = useMemo(() => {
    // Mock retention rate for now
    return 85.5;
  }, []);
  
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Carregando dados de usuários...</Typography>
      </Box>
    );
  }
  
  return (
    <Box id="user-dashboard" sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard de Usuários
        </Typography>
        
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleExportPDF}
            startIcon={<DownloadIcon />}
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
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      {/* Cards de métricas principais */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <UserMetricsCard 
            title="Total de Usuários" 
            value={mockUsers.length.toString()}
            change={userGrowthRate}
            icon={<GroupIcon />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <UserMetricsCard 
            title="Usuários Ativos" 
            value={mockUsers.filter(u => u.status === 'active').length.toString()}
            change={+12.3}
            icon={<PersonIcon />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <UserMetricsCard 
            title="Taxa de Retenção" 
            value={`${retentionRate.toFixed(1)}%`}
            change={+3.5}
            icon={<TrendingUpIcon />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <UserMetricsCard 
            title="Verificados KYC" 
            value={mockUsers.filter(u => u.kycStatus === 'verified').length.toString()}
            change={+18.7}
            icon={<VerifiedUserIcon />}
          />
        </Grid>
      </Grid>
      
      {/* Gráficos principais */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardHeader 
              title="Crescimento de Usuários" 
              subheader={`Últimos ${timeRange === '7d' ? '7 dias' : timeRange === '30d' ? '30 dias' : timeRange === '90d' ? '90 dias' : '12 meses'}`}
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={userGrowth}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(parseISO(date), 'dd/MM', { locale: ptBR })}
                  />
                  <YAxis />
                  <RechartsTooltip 
                    labelFormatter={(date) => format(parseISO(date), 'dd/MM/yyyy', { locale: ptBR })}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="totalUsers" 
                    name="Total de Usuários"
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="activeUsers" 
                    name="Usuários Ativos"
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.3}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="newUsers" 
                    name="Novos Usuários"
                    stroke="#ff7300" 
                    dot={{ stroke: '#ff7300', strokeWidth: 2, r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Distribuição por Perfil" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userSegments}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="segment"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {userSegments.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: any, name: string) => {
                      if (typeof value === 'number') {
                        return [`${value.toFixed(1)}%`, name];
                      }
                      return [value, name];
                    }}
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
          <Tab label="Lista de Usuários" icon={<PeopleAltIcon />} iconPosition="start" />
          <Tab label="Atividade" icon={<AssessmentIcon />} iconPosition="start" />
          <Tab label="Segmentação" icon={<BarChartIcon />} iconPosition="start" />
        </Tabs>
        
        <Box p={3}>
          {/* Conteúdo da aba de Lista de Usuários */}
          {tabValue === 0 && (
            <>
              <Box mb={3} display="flex" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 200, mr: 2 }}>
                    <InputLabel>Perfil de Usuário</InputLabel>
                    <Select
                      value={selectedRole}
                      onChange={handleRoleChange}
                      label="Perfil de Usuário"
                    >
                      <MenuItem value="all">Todos os Perfis</MenuItem>
                      <MenuItem value="active">Ativos</MenuItem>
                      <MenuItem value="inactive">Inativos</MenuItem>
                      <MenuItem value="verified">Verificados KYC</MenuItem>
                      <MenuItem value="unverified">Não Verificados KYC</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  Exibindo {filteredUsers.length} de {mockUsers.length} usuários
                </Typography>
              </Box>
              
              <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Usuário</TableCell>
                      <TableCell>Perfil</TableCell>
                      <TableCell>Data de Registro</TableCell>
                      <TableCell>Última Atividade</TableCell>
                      <TableCell align="right">Transações</TableCell>
                      <TableCell align="right">Staking (AGRO)</TableCell>
                      <TableCell align="right">NFTs</TableCell>
                      <TableCell align="center">KYC</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar 
                              src={`https://via.placeholder.com/50?text=${user.name?.[0] || 'U'}`} 
                              alt={user.name || user.email} 
                              sx={{ mr: 2, width: 40, height: 40 }}
                            >
                              {!user.name && user.email?.[0]}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {user.name || user.email}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={
                              user.status === 'active' ? 'Ativo' : 'Inativo'
                            } 
                            size="small" 
                            color={
                              user.status === 'active' ? 'success' : 'default'
                            } 
                            variant="outlined" 
                          />
                        </TableCell>
                        <TableCell>
                          {format(parseISO(user.joinDate), 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          {format(parseISO(user.lastActivity), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {user.totalTransactions}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {stakedAmount}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {nftCount}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {user.kycStatus === 'verified' ? (
                            <Tooltip title="Verificado">
                              <VerifiedUserIcon color="success" fontSize="small" />
                            </Tooltip>
                          ) : (
                            <Tooltip title="Não Verificado">
                              <SecurityIcon color="disabled" fontSize="small" />
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          
          {/* Conteúdo da aba de Atividade */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Atividade de Usuários" />
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={userActivity}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => format(parseISO(date), 'dd/MM', { locale: ptBR })}
                        />
                        <YAxis />
                        <RechartsTooltip 
                          labelFormatter={(date) => format(parseISO(date), 'dd/MM/yyyy', { locale: ptBR })}
                        />
                        <Legend />
                        <Bar 
                          dataKey="logins" 
                          name="Logins" 
                          stackId="a" 
                          fill={COLORS[0]} 
                        />
                        <Bar 
                          dataKey="transactions" 
                          name="Transações" 
                          stackId="a" 
                          fill={COLORS[1]} 
                        />
                        <Bar 
                          dataKey="stakingActions" 
                          name="Ações de Staking" 
                          stackId="a" 
                          fill={COLORS[2]} 
                        />
                        <Bar 
                          dataKey="nftActions" 
                          name="Ações com NFTs" 
                          stackId="a" 
                          fill={COLORS[3]} 
                        />
                        <Bar 
                          dataKey="governanceActions" 
                          name="Ações de Governança" 
                          stackId="a" 
                          fill={COLORS[4]} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Horários de Pico" />
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={[
                          { hour: '00:00', users: 120 },
                          { hour: '02:00', users: 80 },
                          { hour: '04:00', users: 40 },
                          { hour: '06:00', users: 30 },
                          { hour: '08:00', users: 150 },
                          { hour: '10:00', users: 310 },
                          { hour: '12:00', users: 290 },
                          { hour: '14:00', users: 350 },
                          { hour: '16:00', users: 420 },
                          { hour: '18:00', users: 380 },
                          { hour: '20:00', users: 290 },
                          { hour: '22:00', users: 210 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <RechartsTooltip />
                        <Line 
                          type="monotone" 
                          dataKey="users" 
                          name="Usuários Ativos" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Dispositivos e Plataformas" />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>Dispositivos</Typography>
                        <ResponsiveContainer width="100%" height={150}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Desktop', value: 45 },
                                { name: 'Mobile', value: 40 },
                                { name: 'Tablet', value: 15 },
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={60}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {[
                                { name: 'Desktop', value: 45 },
                                { name: 'Mobile', value: 40 },
                                { name: 'Tablet', value: 15 },
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>Navegadores</Typography>
                        <ResponsiveContainer width="100%" height={150}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Chrome', value: 55 },
                                { name: 'Firefox', value: 20 },
                                { name: 'Safari', value: 15 },
                                { name: 'Edge', value: 10 },
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={60}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {[
                                { name: 'Chrome', value: 55 },
                                { name: 'Firefox', value: 20 },
                                { name: 'Safari', value: 15 },
                                { name: 'Edge', value: 10 },
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
          
          {/* Conteúdo da aba de Segmentação */}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Distribuição Geográfica" />
                  <CardContent>
                    <UserMap locations={userLocations} height={300} />
                    
                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom>Principais Países</Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>País</TableCell>
                              <TableCell align="right">Usuários</TableCell>
                              <TableCell align="right">Percentual</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {userLocations.slice(0, 5).map((geo) => (
                              <TableRow key={geo.id} hover>
                                <TableCell>
                                  <Box display="flex" alignItems="center">
                                    <PublicIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                    {geo.region}
                                  </Box>
                                </TableCell>
                                <TableCell align="right">{geo.users}</TableCell>
                                <TableCell align="right">{geo.percentage.toFixed(1)}%</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Análise de Valor por Segmento" />
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      >
                        <CartesianGrid />
                        <XAxis 
                          type="number" 
                          dataKey="count" 
                          name="Número de Usuários" 
                          unit="" 
                        />
                        <YAxis 
                          type="number" 
                          dataKey="avgValue" 
                          name="Valor Médio" 
                          unit=" USD" 
                        />
                        <ZAxis 
                          type="number" 
                          dataKey="percentage" 
                          range={[50, 400]} 
                          name="% do Total" 
                          unit="%" 
                        />
                        <RechartsTooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          formatter={(value: any, name: string, props: any) => {
                            if (name === 'Valor Médio') return [`$${(value as number).toFixed(2)} USD`, name];
                            if (name === 'Número de Usuários') return [value, name];
                            if (name === '% do Total') return [`${(value as number).toFixed(1)}%`, name];
                            return [value, name];
                          }}
                        />
                        <Legend />
                        <Scatter 
                          name="Segmentos de Usuários" 
                          data={userSegments} 
                          fill="#8884d8"
                          shape="circle"
                        >
                          {userSegments.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                    
                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom>Detalhamento por Segmento</Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Segmento</TableCell>
                              <TableCell align="right">Usuários</TableCell>
                              <TableCell align="right">Valor Médio</TableCell>
                              <TableCell align="right">Crescimento</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {userSegments.map((segment: any) => (
                              <TableRow key={segment.id || segment.name} hover>
                                <TableCell>{segment.name || segment.segment}</TableCell>
                                <TableCell align="right">{segment.count}</TableCell>
                                <TableCell align="right">${(segment.avgValue || 0).toLocaleString()}</TableCell>
                                <TableCell align="right">
                                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                                    {(segment.growth || 0) > 0 ? (
                                      <TrendingUpIcon fontSize="small" color="success" sx={{ mr: 0.5 }} />
                                    ) : (
                                      <TrendingUpIcon fontSize="small" color="error" sx={{ mr: 0.5, transform: 'rotate(180deg)' }} />
                                    )}
                                    {Math.abs(segment.growth || 0).toFixed(1)}%
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Comportamento de Usuário" />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" gutterBottom>Frequência de Uso</Typography>
                        <List>
                          <ListItem>
                            <ListItemIcon>
                              <AccountBalanceWalletIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Usuários Diários" 
                              secondary={`${((mockUsers.filter(u => u.status === 'active').length * 0.35) / mockUsers.length * 100).toFixed(1)}% do total`} 
                            />
                            <Typography variant="body2">
                              {Math.round(mockUsers.filter(u => u.status === 'active').length * 0.35)}
                            </Typography>
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <AccountBalanceWalletIcon color="secondary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Usuários Semanais" 
                              secondary={`${((mockUsers.filter(u => u.status === 'active').length * 0.30) / mockUsers.length * 100).toFixed(1)}% do total`} 
                            />
                            <Typography variant="body2">
                              {Math.round(mockUsers.filter(u => u.status === 'active').length * 0.30)}
                            </Typography>
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <AccountBalanceWalletIcon color="warning" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Usuários Mensais" 
                              secondary={`${((mockUsers.filter(u => u.status === 'active').length * 0.35) / mockUsers.length * 100).toFixed(1)}% do total`} 
                            />
                            <Typography variant="body2">
                              {Math.round(mockUsers.filter(u => u.status === 'active').length * 0.35)}
                            </Typography>
                          </ListItem>
                        </List>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" gutterBottom>Engajamento</Typography>
                        <List>
                          <ListItem>
                            <ListItemIcon>
                              <LocalAtmIcon color="success" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Staking Ativo" 
                              secondary={`${((mockUsers.length * 0.42) / mockUsers.length * 100).toFixed(1)}% do total`} 
                            />
                            <Typography variant="body2">
                              {Math.round(mockUsers.length * 0.42)}
                            </Typography>
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <AssessmentIcon color="info" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Participação em DAO" 
                              secondary={`${((mockUsers.length * 0.18) / mockUsers.length * 100).toFixed(1)}% do total`} 
                            />
                            <Typography variant="body2">
                              {Math.round(mockUsers.length * 0.18)}
                            </Typography>
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <BarChartIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Trading de NFTs" 
                              secondary={`${((mockUsers.length * 0.25) / mockUsers.length * 100).toFixed(1)}% do total`} 
                            />
                            <Typography variant="body2">
                              {Math.round(mockUsers.length * 0.25)}
                            </Typography>
                          </ListItem>
                        </List>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" gutterBottom>Retenção por Tempo</Typography>
                        <List>
                          <ListItem>
                            <ListItemIcon>
                              <GroupIcon color="success" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="> 6 meses" 
                              secondary={`${((mockUsers.length * 0.38) / mockUsers.length * 100).toFixed(1)}% do total`} 
                            />
                            <Typography variant="body2">
                              {Math.round(mockUsers.length * 0.38)}
                            </Typography>
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <GroupIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="3-6 meses" 
                              secondary={`${((mockUsers.length * 0.27) / mockUsers.length * 100).toFixed(1)}% do total`} 
                            />
                            <Typography variant="body2">
                              {Math.round(mockUsers.length * 0.27)}
                            </Typography>
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <GroupIcon color="warning" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="< 3 meses" 
                              secondary={`${((mockUsers.length * 0.35) / mockUsers.length * 100).toFixed(1)}% do total`} 
                            />
                            <Typography variant="body2">
                              {Math.round(mockUsers.length * 0.35)}
                            </Typography>
                          </ListItem>
                        </List>
                      </Grid>
                    </Grid>
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

export default UsersDashboard;