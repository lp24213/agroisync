import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface UserLocation {
  id: string;
  region: string;
  users: number;
  percentage: number;
  color: string;
}

interface UserMapProps {
  locations: UserLocation[];
  height?: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const UserMap: React.FC<UserMapProps> = ({ 
  locations, 
  height = 400 
}) => {
  // Transform locations data for the chart
  const chartData = locations.map((location, index) => ({
    name: location.region,
    value: location.users,
    percentage: location.percentage,
    color: COLORS[index % COLORS.length]
  }));

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Typography variant="body2" fontWeight="bold">
            {data.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Usuários: {formatValue(data.value)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Percentage: {data.percentage.toFixed(1)}%
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  if (!locations || locations.length === 0) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height={height}
        sx={{ 
          backgroundColor: 'grey.100', 
          borderRadius: 1,
          border: '2px dashed',
          borderColor: 'grey.300'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Nenhum dado de usuários disponível
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height }}>
      <Typography variant="h6" gutterBottom align="center">
        Distribuição Geográfica de Usuários
      </Typography>
      
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      
      <Box mt={2}>
        <Typography variant="body2" color="text.secondary" align="center">
          Total de Usuários: {formatValue(locations.reduce((sum, location) => sum + location.users, 0))}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserMap;
