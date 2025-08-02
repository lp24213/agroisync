'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { SecurityEvent, SecurityEventType } from '../../types/web3';

interface SecurityDashboardProps {
  className?: string;
}

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
  className = ''
}) => {
  const [recentEvents, setRecentEvents] = useState<Array<{
    id: string;
    type: SecurityEventType;
    ip: string;
    threatLevel: string;
    timestamp: string;
  }>>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    highThreat: 0,
    mediumThreat: 0,
    lowThreat: 0
  });

  useEffect(() => {
    // Mock data
    const events: SecurityEvent[] = [
      {
        id: '1',
        type: 'login',
        ip: '192.168.1.100',
        threatLevel: 'low',
        timestamp: Date.now()
      },
      {
        id: '2',
        type: 'failed_login',
        ip: '10.0.0.50',
        threatLevel: 'medium',
        timestamp: Date.now() - 3600000
      },
      {
        id: '3',
        type: 'suspicious_activity',
        ip: '203.0.113.0',
        threatLevel: 'high',
        timestamp: Date.now() - 7200000
      }
    ];

    // Convert timestamp to string
    const convertedEvents = events.map(event => ({
      ...event,
      timestamp: typeof event.timestamp === 'number' 
        ? new Date(event.timestamp).toISOString() 
        : event.timestamp
    }));

    setRecentEvents(convertedEvents);

    // Calculate stats
    setStats({
      totalEvents: events.length,
      highThreat: events.filter(e => e.threatLevel === 'high').length,
      mediumThreat: events.filter(e => e.threatLevel === 'medium').length,
      lowThreat: events.filter(e => e.threatLevel === 'low').length
    });
  }, []);

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getEventIcon = (type: SecurityEventType) => {
    switch (type) {
      case 'login': return '🔐';
      case 'logout': return '🚪';
      case 'failed_login': return '❌';
      case 'suspicious_activity': return '⚠️';
      case 'blocked_ip': return '🚫';
      default: return '📊';
    }
  };

  return (
    <div className={`security-dashboard ${className}`}>
      <h2 className="text-2xl font-bold mb-6">Security Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalEvents}</div>
            <div className="text-sm text-gray-600">Total Events</div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.highThreat}</div>
            <div className="text-sm text-gray-600">High Threat</div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.mediumThreat}</div>
            <div className="text-sm text-gray-600">Medium Threat</div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.lowThreat}</div>
            <div className="text-sm text-gray-600">Low Threat</div>
          </div>
        </Card>
      </div>

      {/* Recent Events */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Security Events</h3>
        
        <div className="space-y-3">
          {recentEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{getEventIcon(event.type)}</span>
                <div>
                  <div className="font-medium">{event.type.replace('_', ' ')}</div>
                  <div className="text-sm text-gray-600">IP: {event.ip}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-medium ${getThreatColor(event.threatLevel)}`}>
                  {event.threatLevel.toUpperCase()}
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(event.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
