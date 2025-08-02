'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useProtectedRole } from '@/hooks/useProtectedRole';
import { validation } from '@/utils/validation';

interface ComplianceMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  status: 'compliant' | 'warning' | 'non-compliant';
  lastUpdated: Date;
}

interface ComplianceReport {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewer?: string;
}

export function ComplianceDashboard() {
  const { isAdmin, hasPermission } = useProtectedRole();
  const [metrics, setMetrics] = React.useState<ComplianceMetric[]>([]);
  const [reports, setReports] = React.useState<ComplianceReport[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simular carregamento de dados de compliance
    const mockMetrics: ComplianceMetric[] = [
      {
        id: '1',
        name: 'KYC Completion Rate',
        value: 95.2,
        target: 90,
        unit: '%',
        status: 'compliant',
        lastUpdated: new Date(),
      },
      {
        id: '2',
        name: 'AML Screening Pass Rate',
        value: 98.7,
        target: 95,
        unit: '%',
        status: 'compliant',
        lastUpdated: new Date(),
      },
      {
        id: '3',
        name: 'Transaction Monitoring Alerts',
        value: 12,
        target: 10,
        unit: 'alerts',
        status: 'warning',
        lastUpdated: new Date(),
      },
      {
        id: '4',
        name: 'Regulatory Reporting Accuracy',
        value: 99.1,
        target: 99,
        unit: '%',
        status: 'compliant',
        lastUpdated: new Date(),
      },
    ];

    const mockReports: ComplianceReport[] = [
      {
        id: '1',
        title: 'Monthly AML Report',
        description: 'Anti-Money Laundering compliance report for January 2024',
        status: 'approved',
        submittedAt: new Date('2024-01-31'),
        reviewedAt: new Date('2024-02-02'),
        reviewer: 'Compliance Officer',
      },
      {
        id: '2',
        title: 'KYC Audit Report',
        description: 'Know Your Customer audit findings and recommendations',
        status: 'pending',
        submittedAt: new Date('2024-02-15'),
      },
      {
        id: '3',
        title: 'Regulatory Compliance Review',
        description: 'Quarterly regulatory compliance assessment',
        status: 'approved',
        submittedAt: new Date('2024-01-15'),
        reviewedAt: new Date('2024-01-20'),
        reviewer: 'Legal Team',
      },
    ];

    setTimeout(() => {
      setMetrics(mockMetrics);
      setReports(mockReports);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'non-compliant':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-500/20';
      case 'warning':
        return 'bg-yellow-500/20';
      case 'non-compliant':
        return 'bg-red-500/20';
      default:
        return 'bg-gray-500/20';
    }
  };

  if (!hasPermission('view_analytics')) {
    return (
      <div className="min-h-screen bg-agro-darker flex items-center justify-center">
        <Card className="max-w-md w-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
            <p className="text-gray-400">
              Você não tem permissão para acessar o dashboard de compliance.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-agro-darker p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-agro-darker p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Compliance Dashboard</h1>
          <p className="text-gray-400">
            Monitoramento de conformidade regulatória e relatórios
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <Card key={metric.id}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-400">{metric.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBgColor(metric.status)} ${getStatusColor(metric.status)}`}>
                  {metric.status}
                </span>
              </div>
              
              <div className="mb-2">
                <span className="text-2xl font-bold text-white">
                  {validation.formatNumber(metric.value)}
                </span>
                <span className="text-gray-400 ml-1">{metric.unit}</span>
              </div>
              
              <div className="text-sm text-gray-400">
                Meta: {validation.formatNumber(metric.target)} {metric.unit}
              </div>
              
              <div className="mt-3 text-xs text-gray-500">
                Atualizado: {metric.lastUpdated.toLocaleDateString('pt-BR')}
              </div>
            </Card>
          ))}
        </div>

        {/* Reports Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Reports */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Relatórios Recentes</h2>
              {isAdmin() && (
                <Button variant="primary" size="sm">
                  Novo Relatório
                </Button>
              )}
            </div>
            
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="p-4 bg-agro-dark/50 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white">{report.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      report.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      report.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-3">{report.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Enviado: {report.submittedAt.toLocaleDateString('pt-BR')}</span>
                    {report.reviewer && (
                      <span>Revisor: {report.reviewer}</span>
                    )}
                  </div>
                  
                  {isAdmin() && report.status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <Button variant="primary" size="sm">Aprovar</Button>
                      <Button variant="outline" size="sm">Rejeitar</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Compliance Actions */}
          <Card>
            <h2 className="text-xl font-bold text-white mb-6">Ações de Compliance</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-agro-dark/50 rounded-lg border border-gray-700">
                <h3 className="font-semibold text-white mb-2">KYC Verification</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Verificação de identidade pendente para novos usuários
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">15 pendentes</span>
                  <Button variant="primary" size="sm">Verificar</Button>
                </div>
              </div>
              
              <div className="p-4 bg-agro-dark/50 rounded-lg border border-gray-700">
                <h3 className="font-semibold text-white mb-2">AML Screening</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Triagem anti-lavagem de dinheiro em transações suspeitas
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">3 alertas</span>
                  <Button variant="secondary" size="sm">Investigar</Button>
                </div>
              </div>
              
              <div className="p-4 bg-agro-dark/50 rounded-lg border border-gray-700">
                <h3 className="font-semibold text-white mb-2">Regulatory Reporting</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Relatórios regulatórios mensais e trimestrais
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Próximo: 28/02</span>
                  <Button variant="outline" size="sm">Preparar</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 