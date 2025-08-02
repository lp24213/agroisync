import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  LinearProgress
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

interface NFTMetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'percentage' | 'absolute';
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  subtitle?: string;
  progress?: number;
  maxProgress?: number;
}

const NFTMetricsCard: React.FC<NFTMetricsCardProps> = ({
  title,
  value,
  change,
  changeType = 'percentage',
  icon,
  color = 'primary',
  subtitle,
  progress,
  maxProgress = 100
}) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  const formatChange = (changeValue: number): string => {
    if (changeType === 'percentage') {
      return `${changeValue >= 0 ? '+' : ''}${changeValue.toFixed(1)}%`;
    }
    return `${changeValue >= 0 ? '+' : ''}${formatValue(changeValue)}`;
  };

  const getTrendIcon = (changeValue: number) => {
    if (changeValue > 0) {
      return <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />;
    } else if (changeValue < 0) {
      return <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />;
    }
    return <TrendingFlatIcon sx={{ fontSize: 16, color: 'text.secondary' }} />;
  };

  const getTrendColor = (changeValue: number): 'success' | 'error' | 'default' => {
    if (changeValue > 0) return 'success';
    if (changeValue < 0) return 'error';
    return 'default';
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" component="h3" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          {icon && (
            <Avatar 
              sx={{ 
                bgcolor: `${color}.light`,
                color: `${color}.main`,
                width: 40,
                height: 40
              }}
            >
              {icon}
            </Avatar>
          )}
        </Box>

        <Typography 
          variant="h4" 
          component="div" 
          fontWeight="bold"
          color={`${color}.main`}
          mb={1}
        >
          {formatValue(value)}
        </Typography>

        {subtitle && (
          <Typography variant="body2" color="text.secondary" mb={1}>
            {subtitle}
          </Typography>
        )}

        {change !== undefined && (
          <Box display="flex" alignItems="center" gap={0.5} mb={1}>
            {getTrendIcon(change)}
            <Chip
              label={formatChange(change)}
              size="small"
              color={getTrendColor(change)}
              variant="outlined"
            />
          </Box>
        )}

        {progress !== undefined && (
          <Box mt={2}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" color="text.secondary">
                Progresso
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {progress.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={(progress / maxProgress) * 100}
              color={color}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default NFTMetricsCard;