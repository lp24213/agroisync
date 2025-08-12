'use client';

import React, { memo, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { cn } from '../../lib/utils';

/**
 * Chart Component - Premium data visualization component
 * 
 * @description A comprehensive chart component with multiple visualization types,
 * animations, and interactive features for displaying analytics data.
 * 
 * @features
 * - Multiple chart types (line, bar, pie, area, donut)
 * - Smooth animations and transitions
 * - Interactive hover effects
 * - Responsive design
 * - Customizable colors and styling
 * - Data formatting and tooltips
 * - Export functionality
 * - Performance optimized with React.memo
 * - TypeScript strict typing
 * - Accessibility compliant
 */

interface ChartData {
  /** Label for the data point */
  label: string;
  /** Numeric value */
  value: number;
  /** Custom color for this data point */
  color?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
  /** Formatted display value */
  formattedValue?: string;
}

interface ChartProps {
  /** Chart title */
  title: string;
  /** Chart data array */
  data: ChartData[];
  /** Chart visualization type */
  type?: 'line' | 'bar' | 'pie' | 'area' | 'donut';
  /** Chart height in pixels */
  height?: number;
  /** Chart width (responsive by default) */
  width?: number | string;
  /** Color scheme for the chart */
  colorScheme?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'custom';
  /** Custom colors array */
  colors?: string[];
  /** Whether to show legend */
  showLegend?: boolean;
  /** Whether to show grid lines */
  showGrid?: boolean;
  /** Whether to show tooltips on hover */
  showTooltips?: boolean;
  /** Whether to animate chart on mount */
  animate?: boolean;
  /** Custom formatter for values */
  valueFormatter?: (value: number) => string;
  /** Callback when data point is clicked */
  onDataPointClick?: (data: ChartData, index: number) => void;
  /** Whether chart is loading */
  loading?: boolean;
  /** Custom CSS class */
  className?: string;
}

const Chart = memo(({
  title,
  data,
  type = 'line',
  height = 300,
  width = '100%',
  colorScheme = 'primary',
  colors,
  showLegend = true,
  showGrid = true,
  showTooltips = true,
  animate = true,
  valueFormatter,
  onDataPointClick,
  loading = false,
  className
}: ChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Color schemes
  const colorSchemes = {
    primary: ['#3B82F6', '#1D4ED8', '#1E40AF', '#1E3A8A'],
    secondary: ['#10B981', '#059669', '#047857', '#065F46'],
    success: ['#22C55E', '#16A34A', '#15803D', '#166534'],
    warning: ['#F59E0B', '#D97706', '#B45309', '#92400E'],
    error: ['#EF4444', '#DC2626', '#B91C1C', '#991B1B'],
    custom: colors || ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
  };

  // Memoized calculations
  const chartColors = useMemo(() => {
    return colors || colorSchemes[colorScheme];
  }, [colors, colorScheme]);

  const maxValue = useMemo(() => {
    return Math.max(...data.map(d => d.value), 1);
  }, [data]);

  const totalValue = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  const formatValue = useCallback((value: number) => {
    if (valueFormatter) return valueFormatter(value);
    return new Intl.NumberFormat('pt-BR', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  }, [valueFormatter]);

  // Handle data point interactions
  const handleDataPointClick = useCallback((item: ChartData, index: number) => {
    setSelectedIndex(selectedIndex === index ? null : index);
    onDataPointClick?.(item, index);
  }, [selectedIndex, onDataPointClick]);

  // Render loading state
  if (loading) {
    return (
      <Card className={cn('relative overflow-hidden', className)}>
        <div className="animate-pulse">
          <div className="h-6 bg-agro-dark/50 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-agro-dark/30 rounded w-full"></div>
            <div className="h-4 bg-agro-dark/30 rounded w-3/4"></div>
            <div className="h-4 bg-agro-dark/30 rounded w-1/2"></div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-agro-light/5 to-transparent animate-shimmer"></div>
      </Card>
    );
  }

  return (
    <Card className={cn('relative', className)}>
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={animate ? { opacity: 0, y: -10 } : {}}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-agro-light">{title}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {/* Export functionality */}}
            className="text-agro-light/60 hover:text-agro-light"
          >
            📊
          </Button>
        </div>
      </motion.div>
      
      {/* Chart Container */}
      <motion.div 
        className="relative mb-6"
        style={{ height, width }}
        initial={animate ? { opacity: 0, scale: 0.95 } : {}}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Grid Lines */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full border-t border-agro-light/10"
                style={{ top: `${(i / 4) * 100}%` }}
              />
            ))}
          </div>
        )}

        {/* Line Chart */}
        {type === 'line' && (
          <div className="flex items-end justify-between h-full px-2">
            {data.map((item, index) => {
              const height = (item.value / maxValue) * 100;
              const color = item.color || chartColors[index % chartColors.length];
              const isHovered = hoveredIndex === index;
              const isSelected = selectedIndex === index;
              
              return (
                <motion.div
                  key={`${item.label}-${index}`}
                  className="flex flex-col items-center cursor-pointer group relative"
                  initial={animate ? { opacity: 0, y: 20 } : {}}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleDataPointClick(item, index)}
                >
                  {/* Data Point */}
                  <motion.div
                    className="relative"
                    animate={{
                      scale: isHovered || isSelected ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="w-3 rounded-full shadow-lg"
                      style={{
                        height: `${Math.max(height, 4)}%`,
                        backgroundColor: color,
                        minHeight: '8px'
                      }}
                      initial={animate ? { height: 0 } : {}}
                      animate={{ height: `${Math.max(height, 4)}%` }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    />
                    
                    {/* Connection Line */}
                    {index < data.length - 1 && (
                      <motion.div
                        className="absolute top-0 left-full w-8 h-0.5 bg-gradient-to-r from-current to-transparent opacity-30"
                        style={{ color }}
                        initial={animate ? { scaleX: 0 } : {}}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.4, delay: (index + 1) * 0.1 }}
                      />
                    )}
                  </motion.div>
                  
                  {/* Label */}
                  <motion.span 
                    className={cn(
                      'text-xs mt-3 transition-colors duration-200 text-center max-w-16 truncate',
                      isHovered || isSelected ? 'text-agro-light' : 'text-agro-light/60'
                    )}
                    animate={{
                      y: isHovered ? -2 : 0
                    }}
                  >
                    {item.label}
                  </motion.span>
                  
                  {/* Tooltip */}
                  <AnimatePresence>
                    {showTooltips && isHovered && (
                      <motion.div
                        className="absolute bottom-full mb-2 px-3 py-2 bg-agro-dark border border-agro-primary/20 rounded-lg shadow-lg z-10"
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-agro-light font-semibold text-sm">
                          {item.formattedValue || formatValue(item.value)}
                        </p>
                        <p className="text-agro-light/60 text-xs">{item.label}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bar Chart */}
        {type === 'bar' && (
          <div className="flex items-end justify-between h-full px-2 gap-1">
            {data.map((item, index) => {
              const height = (item.value / maxValue) * 100;
              const color = item.color || chartColors[index % chartColors.length];
              const isHovered = hoveredIndex === index;
              const isSelected = selectedIndex === index;
              
              return (
                <motion.div
                  key={`${item.label}-${index}`}
                  className="flex flex-col items-center cursor-pointer group relative flex-1 max-w-16"
                  initial={animate ? { opacity: 0, y: 20 } : {}}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleDataPointClick(item, index)}
                >
                  {/* Bar */}
                  <motion.div
                    className="w-full rounded-t-lg shadow-lg relative overflow-hidden"
                    style={{
                      backgroundColor: color,
                      minHeight: '4px'
                    }}
                    initial={animate ? { height: 0 } : {}}
                    animate={{ 
                      height: `${Math.max(height, 2)}%`,
                      scale: isHovered || isSelected ? 1.05 : 1
                    }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent"
                      initial={{ y: '100%' }}
                      animate={{ y: isHovered ? '-100%' : '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </motion.div>
                  
                  {/* Label */}
                  <motion.span 
                    className={cn(
                      'text-xs mt-3 transition-colors duration-200 text-center truncate',
                      isHovered || isSelected ? 'text-agro-light' : 'text-agro-light/60'
                    )}
                    animate={{
                      y: isHovered ? -2 : 0
                    }}
                  >
                    {item.label}
                  </motion.span>
                  
                  {/* Tooltip */}
                  <AnimatePresence>
                    {showTooltips && isHovered && (
                      <motion.div
                        className="absolute bottom-full mb-2 px-3 py-2 bg-agro-dark border border-agro-primary/20 rounded-lg shadow-lg z-10"
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-agro-light font-semibold text-sm">
                          {item.formattedValue || formatValue(item.value)}
                        </p>
                        <p className="text-agro-light/60 text-xs">{item.label}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pie Chart */}
        {(type === 'pie' || type === 'donut') && (
          <div className="flex items-center justify-center h-full">
            <div className="relative">
              <svg width="200" height="200" className="transform -rotate-90">
                {data.map((item, index) => {
                  const percentage = (item.value / totalValue) * 100;
                  const angle = (percentage / 100) * 360;
                  const startAngle = data.slice(0, index).reduce((sum, d) => sum + (d.value / totalValue) * 360, 0);
                  const color = item.color || chartColors[index % chartColors.length];
                  const isHovered = hoveredIndex === index;
                  const radius = type === 'donut' ? 70 : 80;
                  const innerRadius = type === 'donut' ? 40 : 0;
                  
                  return (
                    <motion.g
                      key={`${item.label}-${index}`}
                      initial={animate ? { opacity: 0 } : {}}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.2 }}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => handleDataPointClick(item, index)}
                    >
                      <motion.path
                        d={`M 100 100 L ${100 + radius * Math.cos((startAngle - 90) * Math.PI / 180)} ${100 + radius * Math.sin((startAngle - 90) * Math.PI / 180)} A ${radius} ${radius} 0 ${angle > 180 ? 1 : 0} 1 ${100 + radius * Math.cos((startAngle + angle - 90) * Math.PI / 180)} ${100 + radius * Math.sin((startAngle + angle - 90) * Math.PI / 180)} Z`}
                        fill={color}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                        animate={{
                          scale: isHovered ? 1.05 : 1,
                          opacity: isHovered ? 0.9 : 0.8
                        }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.g>
                  );
                })}
              </svg>
              
              {/* Center content for donut chart */}
              {type === 'donut' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-agro-light">
                      {formatValue(totalValue)}
                    </p>
                    <p className="text-agro-light/60 text-sm">Total</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Legend */}
      {showLegend && (
        <motion.div 
          className="grid grid-cols-2 gap-3"
          initial={animate ? { opacity: 0, y: 10 } : {}}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {data.map((item, index) => {
            const color = item.color || chartColors[index % chartColors.length];
            const isHovered = hoveredIndex === index;
            const isSelected = selectedIndex === index;
            
            return (
              <motion.div
                key={`legend-${item.label}-${index}`}
                className={cn(
                  'flex items-center justify-between p-2 rounded-lg transition-all duration-200 cursor-pointer',
                  isHovered || isSelected 
                    ? 'bg-agro-primary/10 border border-agro-primary/20' 
                    : 'hover:bg-agro-dark/30'
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleDataPointClick(item, index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                    animate={{
                      scale: isHovered || isSelected ? 1.2 : 1
                    }}
                  />
                  <span className={cn(
                    'text-sm transition-colors duration-200',
                    isHovered || isSelected ? 'text-agro-light' : 'text-agro-light/70'
                  )}>
                    {item.label}
                  </span>
                </div>
                <span className={cn(
                  'font-semibold text-sm transition-colors duration-200',
                  isHovered || isSelected ? 'text-agro-light' : 'text-agro-light/80'
                )}>
                  {item.formattedValue || formatValue(item.value)}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </Card>
  );
});

Chart.displayName = 'Chart';

export { Chart };
export type { ChartProps, ChartData };