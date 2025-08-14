import React from 'react';
import {
  Box, Card, CardContent, Typography, Avatar,
  Chip, LinearProgress, Tooltip
} from '@mui/material';
import {
  TrendingUp, TrendingDown, AttachMoney,
  ShowChart, Collections, Add
} from '@mui/icons-material';

interface NFTMetricsCardProps {
  title: string;
  value: string;
  change: number;
  icon: 'nft' | 'currency' | 'chart' | 'mint';
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  progress?: number;
  trend?: 'up' | 'down' | 'stable';
}

const NFTMetricsCard: React.FC<NFTMetricsCardProps> = ({
  title,
  value,
  change,
  icon,
  subtitle,
  color = 'primary',
  progress,
  trend = 'stable'
}) => {
  // Mapear ícones
  const getIcon = () => {
    switch (icon) {
      case 'nft':
        return <Collections />;
      case 'currency':
        return <AttachMoney />;
      case 'chart':
        return <ShowChart />;
      case 'mint':
        return <Add />;
      default:
        return <Collections />;
    }
  };

  // Mapear cores
  const getColor = () => {
    switch (color) {
      case 'success':
        return '#4caf50';
      case 'error':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      case 'info':
        return '#2196f3';
      case 'secondary':
        return '#9c27b0';
      default:
        return '#1976d2';
    }
  };

  // Determinar tendência
  const getTrendIcon = () => {
    if (change > 0) {
      return <TrendingUp color="success" />;
    } else if (change < 0) {
      return <TrendingDown color="error" />;
    }
    return <TrendingUp color="disabled" />; // Ícone padrão para mudança zero
  };

  // Determinar cor da mudança
  const getChangeColor = () => {
    if (change > 0) return 'success';
    if (change < 0) return 'error';
    return 'default';
  };

  // Formatar mudança
  const formatChange = (change: number) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid #e0e0e0',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          borderColor: getColor()
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header com ícone e título */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{
                bgcolor: getColor(),
                width: 48,
                height: 48,
                mr: 2
              }}
            >
              {getIcon()}
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" gutterBottom>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          
          {/* Chip de tendência */}
          <Chip
            icon={getTrendIcon()}
            label={formatChange(change)}
            color={getChangeColor() as any}
            size="small"
            variant="outlined"
            sx={{ 
              fontWeight: 'bold',
              '& .MuiChip-icon': {
                fontSize: '1rem'
              }
            }}
          />
        </Box>

        {/* Valor principal */}
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
            color: getColor(),
            mb: 1
          }}
        >
          {value}
        </Typography>

        {/* Barra de progresso (se fornecida) */}
        {progress !== undefined && (
          <Box mt={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Progresso
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: getColor()
                }
              }}
            />
          </Box>
        )}

        {/* Informações adicionais */}
        <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </Typography>
          
          {/* Indicador de status */}
          <Tooltip title={change > 0 ? "Crescimento positivo" : change < 0 ? "Declínio" : "Estável"}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: change > 0 ? '#4caf50' : change < 0 ? '#f44336' : '#9e9e9e',
                animation: change !== 0 ? 'pulse 2s infinite' : 'none'
              }}
            />
          </Tooltip>
        </Box>
      </CardContent>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Card>
  );
};

export default NFTMetricsCard;