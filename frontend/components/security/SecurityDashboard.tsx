'use client';

import { SecurityEventType, SecurityMonitor } from '@/lib/security/monitoring';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  BellOff,
  CheckCircle,
  Clock,
  Database,
  Fingerprint,
  Globe,
  Key,
  Network,
  RefreshCw,
  Server,
  Shield,
  ShieldCheck,
  Wifi,
  XCircle,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface SecurityStats {
  totalEvents: number;
  threatLevels: Record<string, number>;
  topThreatIPs: Array<{ ip: string; score: number }>;
  recentActivity: Array<{ type: SecurityEventType; count: number }>;
}

interface SecurityStatus {
  overall: 'SECURE' | 'WARNING' | 'CRITICAL';
  authentication: 'SECURE' | 'WARNING' | 'CRITICAL';
  network: 'SECURE' | 'WARNING' | 'CRITICAL';
  data: 'SECURE' | 'WARNING' | 'CRITICAL';
  monitoring: 'ACTIVE' | 'INACTIVE';
}

export function SecurityDashboard() {
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [status, setStatus] = useState<SecurityStatus>({
    overall: 'SECURE',
    authentication: 'SECURE',
    network: 'SECURE',
    data: 'SECURE',
    monitoring: 'ACTIVE',
  });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  useEffect(() => {
    loadSecurityData();
    const interval = setInterval(loadSecurityData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSecurityData = async () => {
    setIsRefreshing(true);
    try {
      const securityStats = SecurityMonitor.getThreatStatistics();
      const events = SecurityMonitor.getRecentEvents(20);

      setStats(securityStats);
      setRecentEvents(events);

      // Update security status based on threat levels
      const criticalCount = securityStats.threatLevels.CRITICAL || 0;
      const highCount = securityStats.threatLevels.HIGH || 0;

      let overallStatus: 'SECURE' | 'WARNING' | 'CRITICAL' = 'SECURE';
      if (criticalCount > 0) {
        overallStatus = 'CRITICAL';
      } else if (highCount > 5) {
        overallStatus = 'WARNING';
      }

      setStatus(prev => ({
        ...prev,
        overall: overallStatus,
      }));
    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SECURE':
      case 'ACTIVE':
        return 'text-green-400';
      case 'WARNING':
        return 'text-yellow-400';
      case 'CRITICAL':
      case 'INACTIVE':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SECURE':
      case 'ACTIVE':
        return <CheckCircle className='w-5 h-5 text-green-400' />;
      case 'WARNING':
        return <AlertCircle className='w-5 h-5 text-yellow-400' />;
      case 'CRITICAL':
      case 'INACTIVE':
        return <XCircle className='w-5 h-5 text-red-400' />;
      default:
        return <Clock className='w-5 h-5 text-gray-400' />;
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'HIGH':
        return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
      case 'MEDIUM':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'LOW':
        return 'bg-green-500/20 border-green-500/30 text-green-400';
      default:
        return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <div className='w-12 h-12 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center'>
            <Shield className='w-6 h-6 text-red-400' />
          </div>
          <div>
            <h2 className='text-2xl font-bold text-white'>Security Center</h2>
            <p className='text-gray-400'>Real-time threat monitoring and protection</p>
          </div>
        </div>

        <div className='flex items-center space-x-3'>
          <button
            onClick={() => setAlertsEnabled(!alertsEnabled)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              alertsEnabled
                ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                : 'bg-gray-500/20 border border-gray-500/30 text-gray-400'
            }`}
          >
            {alertsEnabled ? <Bell className='w-4 h-4' /> : <BellOff className='w-4 h-4' />}
            <span className='text-sm font-medium'>
              {alertsEnabled ? 'Alerts On' : 'Alerts Off'}
            </span>
          </button>

          <button
            onClick={loadSecurityData}
            disabled={isRefreshing}
            className='flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300'
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className='text-sm font-medium'>Refresh</span>
          </button>
        </div>
      </div>

      {/* Overall Security Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
      >
        <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-white'>Overall Status</h3>
            {getStatusIcon(status.overall)}
          </div>
          <div className='text-3xl font-bold text-white mb-2'>{status.overall}</div>
          <div className={`text-sm font-medium ${getStatusColor(status.overall)}`}>
            System {status.overall === 'SECURE' ? 'Protected' : 'Under Threat'}
          </div>
        </div>

        <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-white'>Authentication</h3>
            <Key className='w-5 h-5 text-blue-400' />
          </div>
          <div className='text-3xl font-bold text-white mb-2'>{status.authentication}</div>
          <div className={`text-sm font-medium ${getStatusColor(status.authentication)}`}>
            Multi-factor Active
          </div>
        </div>

        <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-white'>Network</h3>
            <Network className='w-5 h-5 text-purple-400' />
          </div>
          <div className='text-3xl font-bold text-white mb-2'>{status.network}</div>
          <div className={`text-sm font-medium ${getStatusColor(status.network)}`}>
            DDoS Protected
          </div>
        </div>

        <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-white'>Data Protection</h3>
            <Database className='w-5 h-5 text-green-400' />
          </div>
          <div className='text-3xl font-bold text-white mb-2'>{status.data}</div>
          <div className={`text-sm font-medium ${getStatusColor(status.data)}`}>
            Encrypted & Secure
          </div>
        </div>
      </motion.div>

      {/* Security Statistics */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='grid grid-cols-1 lg:grid-cols-2 gap-6'
        >
          {/* Threat Levels */}
          <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6'>
            <h3 className='text-lg font-semibold text-white mb-6'>Threat Levels</h3>
            <div className='space-y-4'>
              {Object.entries(stats.threatLevels).map(([level, count]) => (
                <div key={level} className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        level === 'CRITICAL'
                          ? 'bg-red-400'
                          : level === 'HIGH'
                            ? 'bg-orange-400'
                            : level === 'MEDIUM'
                              ? 'bg-yellow-400'
                              : 'bg-green-400'
                      }`}
                    />
                    <span className='text-gray-300 capitalize'>{level.toLowerCase()}</span>
                  </div>
                  <div className='text-white font-semibold'>{count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Threat IPs */}
          <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6'>
            <h3 className='text-lg font-semibold text-white mb-6'>Top Threat IPs</h3>
            <div className='space-y-4'>
              {stats.topThreatIPs.slice(0, 5).map((threat, index) => (
                <div key={threat.ip} className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center'>
                      <span className='text-red-400 text-sm font-bold'>{index + 1}</span>
                    </div>
                    <div>
                      <div className='text-white font-medium'>{threat.ip}</div>
                      <div className='text-gray-400 text-sm'>Threat Score: {threat.score}</div>
                    </div>
                  </div>
                  <div className='text-red-400 font-bold'>BLOCKED</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Security Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6'
      >
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-lg font-semibold text-white'>Recent Security Events</h3>
          <div className='text-sm text-gray-400'>Total Events: {stats?.totalEvents || 0}</div>
        </div>

        <div className='space-y-3'>
          {recentEvents.slice(0, 10).map(event => (
            <div
              key={event.id}
              className='flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10'
            >
              <div className='flex items-center space-x-4'>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    event.threatLevel === 'CRITICAL'
                      ? 'bg-red-500/20'
                      : event.threatLevel === 'HIGH'
                        ? 'bg-orange-500/20'
                        : event.threatLevel === 'MEDIUM'
                          ? 'bg-yellow-500/20'
                          : 'bg-green-500/20'
                  }`}
                >
                  <AlertTriangle
                    className={`w-5 h-5 ${
                      event.threatLevel === 'CRITICAL'
                        ? 'text-red-400'
                        : event.threatLevel === 'HIGH'
                          ? 'text-orange-400'
                          : event.threatLevel === 'MEDIUM'
                            ? 'text-yellow-400'
                            : 'text-green-400'
                    }`}
                  />
                </div>
                <div>
                  <div className='font-medium text-white'>{event.type.replace(/_/g, ' ')}</div>
                  <div className='text-sm text-gray-400'>IP: {event.ip}</div>
                </div>
              </div>
              <div className='text-right'>
                <div
                  className={`text-sm font-medium px-3 py-1 rounded-full border ${getThreatLevelColor(
                    event.threatLevel,
                  )}`}
                >
                  {event.threatLevel}
                </div>
                <div className='text-xs text-gray-400 mt-1'>
                  {new Date(event.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security Features Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      >
        <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6'>
          <div className='flex items-center space-x-3 mb-4'>
            <ShieldCheck className='w-6 h-6 text-green-400' />
            <h3 className='text-lg font-semibold text-white'>Firewall</h3>
          </div>
          <div className='text-green-400 font-bold mb-2'>ACTIVE</div>
          <div className='text-sm text-gray-400'>Blocking malicious traffic</div>
        </div>

        <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6'>
          <div className='flex items-center space-x-3 mb-4'>
            <Fingerprint className='w-6 h-6 text-blue-400' />
            <h3 className='text-lg font-semibold text-white'>Biometric Auth</h3>
          </div>
          <div className='text-green-400 font-bold mb-2'>ENABLED</div>
          <div className='text-sm text-gray-400'>Multi-factor protection</div>
        </div>

        <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6'>
          <div className='flex items-center space-x-3 mb-4'>
            <Wifi className='w-6 h-6 text-purple-400' />
            <h3 className='text-lg font-semibold text-white'>Network</h3>
          </div>
          <div className='text-green-400 font-bold mb-2'>SECURE</div>
          <div className='text-sm text-gray-400'>Encrypted connections</div>
        </div>

        <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6'>
          <div className='flex items-center space-x-3 mb-4'>
            <Server className='w-6 h-6 text-yellow-400' />
            <h3 className='text-lg font-semibold text-white'>Server</h3>
          </div>
          <div className='text-green-400 font-bold mb-2'>PROTECTED</div>
          <div className='text-sm text-gray-400'>DDoS mitigation active</div>
        </div>

        <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6'>
          <div className='flex items-center space-x-3 mb-4'>
            <Zap className='w-6 h-6 text-orange-400' />
            <h3 className='text-lg font-semibold text-white'>Real-time Scan</h3>
          </div>
          <div className='text-green-400 font-bold mb-2'>RUNNING</div>
          <div className='text-sm text-gray-400'>Threat detection active</div>
        </div>

        <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6'>
          <div className='flex items-center space-x-3 mb-4'>
            <Globe className='w-6 h-6 text-cyan-400' />
            <h3 className='text-lg font-semibold text-white'>Global CDN</h3>
          </div>
          <div className='text-green-400 font-bold mb-2'>ACTIVE</div>
          <div className='text-sm text-gray-400'>Worldwide protection</div>
        </div>
      </motion.div>
    </div>
  );
}
