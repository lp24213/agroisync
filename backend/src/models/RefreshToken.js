import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  jwtToken: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // TTL index
  },
  userAgent: {
    type: String,
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUsedAt: {
    type: Date,
    default: null
  },
  revokedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Índices compostos para performance
refreshTokenSchema.index({ userId: 1, isActive: 1 });
refreshTokenSchema.index({ token: 1, isActive: 1 });
refreshTokenSchema.index({ expiresAt: 1, isActive: 1 });

// Método para verificar se o token está válido
refreshTokenSchema.methods.isValid = function() {
  return this.isActive && this.expiresAt > new Date();
};

// Método para revogar o token
refreshTokenSchema.methods.revoke = function() {
  this.isActive = false;
  this.revokedAt = new Date();
  return this.save();
};

// Método estático para limpar tokens expirados
refreshTokenSchema.statics.cleanupExpired = async function() {
  const result = await this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { isActive: false, revokedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }
    ]
  });
  return result.deletedCount;
};

// Método estático para revogar todos os tokens de um usuário
refreshTokenSchema.statics.revokeUserTokens = async function(userId) {
  const result = await this.updateMany(
    { userId, isActive: true },
    { isActive: false, revokedAt: new Date() }
  );
  return result.modifiedCount;
};

// Método estático para obter tokens ativos de um usuário
refreshTokenSchema.statics.getActiveUserTokens = async function(userId) {
  return this.find({
    userId,
    isActive: true,
    expiresAt: { $gt: new Date() }
  }).sort({ createdAt: -1 });
};

// Middleware para atualizar lastUsedAt
refreshTokenSchema.pre('save', function(next) {
  if (this.isModified('lastUsedAt') && this.lastUsedAt) {
    this.lastUsedAt = new Date();
  }
  next();
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
