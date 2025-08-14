import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface StakingPool {
  id: string;
  name: string;
  totalStaked: number;
  percentage: number;
  color: string;
}

interface StakingDistributionMapProps {
  pools: StakingPool[];
  height?: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const StakingDistributionMap: React.FC<StakingDistributionMapProps> = ({ 
  pools, 
  height = 400 
}) => {
  // Transform pools data for the chart
  const chartData = pools.map((pool, index) => ({
    name: pool.name,
    value: pool.totalStaked,
    percentage: pool.percentage,
    color: COLORS[index % COLORS.length]
  }));

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
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
            Total Staked: {formatValue(data.value)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Percentage: {data.percentage.toFixed(1)}%
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  if (!pools || pools.length === 0) {
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
          Nenhum pool de staking disponível
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height }}>
      <Typography variant="h6" gutterBottom align="center">
        Distribuição de Staking por Pool
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
          Total Staked: {formatValue(pools.reduce((sum, pool) => sum + pool.totalStaked, 0))}
        </Typography>
      </Box>
    </Box>
  );
};

export default StakingDistributionMap;
