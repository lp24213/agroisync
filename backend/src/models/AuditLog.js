import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userEmail: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true,
      enum: [
        'ADMIN_DASHBOARD_ACCESS',
        'ADMIN_USERS_LIST',
        'ADMIN_USERS_VIEW',
        'ADMIN_USER_STATUS_CHANGE',
        'ADMIN_USER_DELETE',
        'ADMIN_PRODUCTS_LIST',
        'ADMIN_PRODUCTS_VIEW',
        'ADMIN_PRODUCT_DELETE',
        'ADMIN_PRODUCT_STATUS_CHANGE',
        'ADMIN_PAYMENTS_LIST',
        'ADMIN_PAYMENTS_VIEW',
        'ADMIN_REGISTRATIONS_LIST',
        'ADMIN_REGISTRATIONS_VIEW',
        'ADMIN_ACTIVITY_ACCESS',
        'ADMIN_SYSTEM_SETTINGS_CHANGE',
        'ADMIN_BACKUP_CREATE',
        'ADMIN_BACKUP_RESTORE',
        'ADMIN_LOG_EXPORT',
        'ADMIN_DATA_EXPORT',
        'ADMIN_USER_CREATE',
        'ADMIN_USER_UPDATE',
        'ADMIN_PRODUCT_CREATE',
        'ADMIN_PRODUCT_UPDATE',
        'ADMIN_PAYMENT_PROCESS',
        'ADMIN_PAYMENT_REFUND',
        'ADMIN_REGISTRATION_APPROVE',
        'ADMIN_REGISTRATION_REJECT',
        'ADMIN_SYSTEM_MAINTENANCE',
        'ADMIN_SECURITY_ALERT',
        'ADMIN_PERMISSION_CHANGE',
        'ADMIN_ROLE_CHANGE'
      ]
    },
    resource: {
      type: String,
      required: true,
      enum: [
        'admin_dashboard',
        'admin_users',
        'admin_products',
        'admin_payments',
        'admin_registrations',
        'admin_activity',
        'admin_settings',
        'admin_backup',
        'admin_logs',
        'admin_security',
        'admin_permissions',
        'admin_roles',
        'system_maintenance'
      ]
    },
    resourceId: {
      type: String,
      default: null
    },
    details: {
      type: String,
      required: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    ip: {
      type: String,
      required: true
    },
    userAgent: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Índices para performance
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ resource: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ ip: 1, createdAt: -1 });

// Método estático para registrar ações
auditLogSchema.statics.logAction = async function (actionData) {
  try {
    const log = new this({
      userId: actionData.userId,
      userEmail: actionData.userEmail,
      action: actionData.action,
      resource: actionData.resource,
      resourceId: actionData.resourceId,
      details: actionData.details,
      metadata: actionData.metadata || {},
      ip: actionData.ip,
      userAgent: actionData.userAgent,
      timestamp: new Date()
    });

    await log.save();
    return log;
  } catch (error) {
    console.error('Erro ao registrar log de auditoria:', error);
    throw error;
  }
};

// Método para buscar logs com filtros
auditLogSchema.statics.getLogs = async function (filters = {}) {
  try {
    const {
      userId,
      action,
      resource,
      startDate,
      endDate,
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const query = {};

    if (userId) {
      query.userId = userId;
    }
    if (action) {
      query.action = action;
    }
    if (resource) {
      query.resource = resource;
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [logs, total] = await Promise.all([
      this.find(query)
        .populate('userId', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit, 10)),
      this.countDocuments(query)
    ]);

    return {
      logs,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    throw error;
  }
};

// Método para estatísticas de auditoria
auditLogSchema.statics.getAuditStats = async function (period = '7d') {
  try {
    const now = new Date();
    let startDate;

    switch (period) {
      case '1d':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const [totalActions, actionsByType, actionsByUser, actionsByResource, recentActions] =
      await Promise.all([
        this.countDocuments({ createdAt: { $gte: startDate } }),
        this.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          { $group: { _id: '$action', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        this.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          { $group: { _id: '$userId', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]),
        this.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          { $group: { _id: '$resource', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        this.find({ createdAt: { $gte: startDate } })
          .populate('userId', 'name email')
          .sort({ createdAt: -1 })
          .limit(10)
      ]);

    return {
      period,
      totalActions,
      actionsByType,
      actionsByUser,
      actionsByResource,
      recentActions
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas de auditoria:', error);
    throw error;
  }
};

// Método para limpeza de logs antigos
auditLogSchema.statics.cleanupOldLogs = async function (retentionDays = 365) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await this.deleteMany({
      createdAt: { $lt: cutoffDate }
    });

    console.log(`Logs de auditoria limpos: ${result.deletedCount} registros removidos`);
    return result.deletedCount;
  } catch (error) {
    console.error('Erro ao limpar logs antigos:', error);
    throw error;
  }
};

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
