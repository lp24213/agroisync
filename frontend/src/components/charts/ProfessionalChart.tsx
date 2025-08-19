import React, { useEffect, useRef, useState } from 'react';
import { Chart, ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  GridLine
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  GridLine
);

interface ProfessionalChartProps {
  type: 'line' | 'bar' | 'doughnut';
  data: any;
  options?: any;
  height?: number;
  className?: string;
}

const ProfessionalChart: React.FC<ProfessionalChartProps> = ({
  type,
  data,
  options,
  height = 400,
  className = ''
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current && chartInstance) {
      chartInstance.destroy();
    }

    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        const newChart = new Chart(ctx, {
          type,
          data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top' as const,
                labels: {
                  color: '#e5e7eb',
                  font: {
                    family: 'Inter',
                    size: 12,
                    weight: '600'
                  },
                  usePointStyle: true,
                  pointStyle: 'circle'
                }
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleColor: '#e5e7eb',
                bodyColor: '#e5e7eb',
                borderColor: '#06b6d4',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                titleFont: {
                  family: 'Inter',
                  size: 14,
                  weight: 'bold'
                },
                bodyFont: {
                  family: 'Inter',
                  size: 12
                }
              }
            },
            scales: type !== 'doughnut' ? {
              x: {
                grid: {
                  color: 'rgba(107, 114, 128, 0.2)',
                  borderColor: 'rgba(107, 114, 128, 0.3)'
                },
                ticks: {
                  color: '#9ca3af',
                  font: {
                    family: 'Inter',
                    size: 11
                  }
                }
              },
              y: {
                grid: {
                  color: 'rgba(107, 114, 128, 0.2)',
                  borderColor: 'rgba(107, 114, 128, 0.3)'
                },
                ticks: {
                  color: '#9ca3af',
                  font: {
                    family: 'Inter',
                    size: 11
                  }
                }
              }
            } : undefined,
            ...options
          }
        });
        setChartInstance(newChart);
      }
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [type, data, options]);

  return (
    <div className={`relative ${className}`} style={{ height }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default ProfessionalChart;
