'use client';

import React, { useState, useEffect } from 'react';

// Inline component definitions to resolve imports
const AnimatedCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div
    className={`bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg transition-all duration-300 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-400/20 ${className}`}
  >
    {children}
  </div>
);

const NeonButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}> = ({ children, variant = 'primary', onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
      variant === 'primary'
        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/50 hover:bg-cyan-500/30 hover:shadow-lg hover:shadow-cyan-400/20'
        : 'bg-gray-700/50 text-gray-300 border border-gray-600/50 hover:bg-gray-600/50 hover:text-white'
    }`}
  >
    {children}
  </button>
);

interface ComplianceMetrics {
  framework: string;
  score: number;
  controls: {
    total: number;
    compliant: number;
    partial: number;
    nonCompliant: number;
  };
  lastAssessment: string;
  trends: {
    period: string;
    score: number;
  }[];
}

interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  controls: ComplianceControl[];
  metrics: ComplianceMetrics;
}

interface ComplianceControl {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'partial' | 'non_compliant';
  evidence: string[];
  lastTested: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
}

export const ComplianceDashboard: React.FC = () => {
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string>('nist');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    setLoading(true);
    try {
      // Integração real: buscar frameworks de compliance do backend
      const res = await fetch('/api/compliance/frameworks');
      const data = await res.json();
      setFrameworks(data.frameworks);
    } catch (err) {
      console.error('Erro ao buscar frameworks de compliance:', err);
      setFrameworks([]);
    }


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-400';
      case 'partial':
        return 'text-yellow-400';
      case 'non_compliant':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-500/20 text-green-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'high':
        return 'bg-orange-500/20 text-orange-400';
      case 'critical':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const selectedFrameworkData = frameworks.find((f) => f.id === selectedFramework);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Framework Selector */}
      <div className="flex space-x-4 mb-6">
        {frameworks.map((framework) => (
          <NeonButton
            key={framework.id}
            variant={selectedFramework === framework.id ? 'primary' : 'secondary'}
            onClick={() => setSelectedFramework(framework.id)}
          >
            {framework.name}
          </NeonButton>
        ))}
      </div>

      {selectedFrameworkData && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <AnimatedCard className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  {selectedFrameworkData.metrics.score}%
                </div>
                <div className="text-gray-400">Compliance Score</div>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {selectedFrameworkData.metrics.controls.compliant}
                </div>
                <div className="text-gray-400">Compliant Controls</div>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {selectedFrameworkData.metrics.controls.partial}
                </div>
                <div className="text-gray-400">Partial Compliance</div>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">
                  {selectedFrameworkData.metrics.controls.nonCompliant}
                </div>
                <div className="text-gray-400">Non-Compliant</div>
              </div>
            </AnimatedCard>
          </div>

          {/* Compliance Trend Chart */}
          <AnimatedCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Compliance Trend</h3>
            <div className="h-64 flex items-end space-x-4">
              {selectedFrameworkData.metrics.trends.map((trend, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-cyan-500/20 to-cyan-400/40 rounded-t"
                    style={{ height: `${(trend.score / 100) * 200}px` }}
                  ></div>
                  <div className="text-sm text-gray-400 mt-2">{trend.period}</div>
                  <div className="text-sm text-cyan-400">{trend.score}%</div>
                </div>
              ))}
            </div>
          </AnimatedCard>

          {/* Controls Table */}
          <AnimatedCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Control Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400">Control ID</th>
                    <th className="text-left py-3 px-4 text-gray-400">Name</th>
                    <th className="text-left py-3 px-4 text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400">Risk</th>
                    <th className="text-left py-3 px-4 text-gray-400">Last Tested</th>
                    <th className="text-left py-3 px-4 text-gray-400">Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedFrameworkData.controls.map((control) => (
                    <tr key={control.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-3 px-4 text-cyan-400 font-mono">{control.id}</td>
                      <td className="py-3 px-4 text-white">{control.name}</td>
                      <td className="py-3 px-4">
                        <span className={`capitalize ${getStatusColor(control.status)}`}>
                          {control.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs capitalize ${getRiskColor(control.risk)}`}
                        >
                          {control.risk}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">{control.lastTested}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {control.evidence.map((evidence, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                            >
                              {evidence}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedCard>

          {/* Framework Description */}
          <AnimatedCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">{selectedFrameworkData.name}</h3>
            <p className="text-gray-400 mb-4">{selectedFrameworkData.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-lg font-semibold text-cyan-400 mb-2">Key Benefits</h4>
                <ul className="text-gray-400 space-y-1">
                  <li>• Structured approach to cybersecurity</li>
                  <li>• Risk-based security controls</li>
                  <li>• Continuous improvement framework</li>
                  <li>• Industry best practices alignment</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-cyan-400 mb-2">Implementation Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Controls:</span>
                    <span className="text-white">
                      {selectedFrameworkData.metrics.controls.total}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Assessment:</span>
                    <span className="text-white">
                      {selectedFrameworkData.metrics.lastAssessment}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Next Review:</span>
                    <span className="text-white">2024-04-15</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </>
      )}
    </div>
  );
}

export default ComplianceDashboard;

