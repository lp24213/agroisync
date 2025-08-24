import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  cpfCnpj: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'carrier', 'admin'],
    default: 'buyer'
  },
  address: {
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      default: 'Brasil',
      trim: true
    },
    cep: {
      type: String,
      trim: true
    }
  },
  modules: {
    store: {
      type: Boolean,
      default: false
    },
    freight: {
      type: Boolean,
      default: false
    },
    crypto: {
      type: Boolean,
      default: false
    }
  },
  plans: {
    store: {
      status: {
        type: String,
        enum: ['inactive', 'active', 'expired', 'cancelled'],
        default: 'inactive'
      },
      tier: {
        type: String,
        enum: ['basic', 'pro', 'enterprise'],
        default: 'basic'
      },
      renewAt: {
        type: Date
      }
    },
    freight: {
      status: {
        type: String,
        enum: ['inactive', 'active', 'expired', 'cancelled'],
        default: 'inactive'
      },
      tier: {
        type: String,
        enum: ['basic', 'pro', 'enterprise'],
        default: 'basic'
      },
      renewAt: {
        type: Date
      }
    },
    crypto: {
      status: {
        type: String,
        enum: ['inactive', 'active', 'expired', 'cancelled'],
        default: 'inactive'
      },
      tier: {
        type: String,
        enum: ['basic', 'pro', 'enterprise'],
        default: 'basic'
      },
      renewAt: {
        type: Date
      }
    }
  },
  passwordHash: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('passwordHash')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
  this.updatedAt = new Date();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Create User model
export const User = mongoose.model('User', userSchema);
