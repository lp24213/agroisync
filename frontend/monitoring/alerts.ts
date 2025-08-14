export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export const createAlert = (
  type: Alert['type'],
  message: string,
  metadata?: Record<string, any>
): Alert => {
  return {
    id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    message,
    timestamp: new Date(),
    metadata
  };
};

export const sendAlert = async (alert: Alert): Promise<boolean> => {
  try {
    // Simulate sending alert
    console.log('Alert sent:', alert);
    return true;
  } catch (error) {
    console.error('Failed to send alert:', error);
    return false;
  }
};

export const getAlertHistory = (): Alert[] => {
  // Mock alert history
  return [
    {
      id: 'alert_1',
      type: 'info',
      message: 'Relatório exportado com sucesso',
      timestamp: new Date(),
      metadata: { reportType: 'pdf', userId: 'user_123' }
    }
  ];
};
