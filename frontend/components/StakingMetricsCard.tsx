import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

interface StakingMetricsCardProps {
  title: string;
  value: string | number;
  change: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

const StakingMetricsCard: React.FC<StakingMetricsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  subtitle,
  icon,
  color = 'primary'
}) => {
  const getChangeIcon = () => {
    if (change > 0) return <TrendingUpIcon color="success" />;
    if (change < 0) return <TrendingDownIcon color="error" />;
    return <TrendingFlatIcon color="action" />;
  };

  const getChangeColor = () => {
    if (change > 0) return 'success';
    if (change < 0) return 'error';
    return 'default';
  };

  const formatChange = (changeValue: number) => {
    const absChange = Math.abs(changeValue);
    if (absChange >= 1) {
      return `${changeValue > 0 ? '+' : ''}${changeValue.toFixed(1)}`;
    }
    return `${changeValue > 0 ? '+' : ''}${changeValue.toFixed(2)}`;
  };

  const formatValue = (value: string | number) => {
    if (typeof value === 'number') {
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(2)}M`;
      } else if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}K`;
      }
      return `$${value.toFixed(2)}`;
    }
    return value;
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              gutterBottom
              sx={{ fontSize: '0.875rem', fontWeight: 500 }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                color: color === 'primary' ? 'primary.main' : undefined
              }}
            >
              {formatValue(value)}
            </Typography>
          </Box>
          
          {icon && (
            <Box 
              sx={{ 
                p: 1, 
                borderRadius: 2,
                backgroundColor: `${color}.light`,
                color: `${color}.main`
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            {getChangeIcon()}
            <Typography 
              variant="body2" 
              color={getChangeColor()}
              sx={{ fontWeight: 600 }}
            >
              {formatChange(change)}%
            </Typography>
          </Box>
          
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        {change !== 0 && (
          <Box mt={1}>
            <Chip
              label={change > 0 ? 'Crescimento' : 'Declínio'}
              size="small"
              color={change > 0 ? 'success' : 'error'}
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StakingMetricsCard;
