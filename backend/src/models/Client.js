import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  cpfCnpj: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  ie: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  
  // Address Information (via API IBGE/Baidu)
  address: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    number: {
      type: String,
      trim: true
    },
    complement: {
      type: String,
      trim: true
    },
    neighborhood: {
      type: String,
      required: true,
      trim: true
    },
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
    zipCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      default: 'Brasil'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },

  // Documents (upload)
  documents: [
    {
      type: {
        type: String,
        required: true,
        enum: ['cpf', 'cnpj', 'ie', 'address_proof', 'identity', 'other']
      },
      filename: {
        type: String,
        required: true
      },
      originalName: {
        type: String,
        required: true
      },
      mimeType: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  // Validation Status
  isDocumentValidated: {
    type: Boolean,
    default: false
  },
  isPaymentVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },

  // Payment Information
  paymentStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['pix', 'credit_card', 'bank_transfer', 'other']
  },
  transactionId: {
    type: String,
    sparse: true
  },

  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Índices para melhor performance
clientSchema.index({ email: 1 });
clientSchema.index({ cpfCnpj: 1 });
clientSchema.index({ userId: 1 });
clientSchema.index({ isDocumentValidated: 1 });
clientSchema.index({ isPaymentVerified: 1 });
clientSchema.index({ createdAt: -1 });

// Middleware para atualizar timestamp
clientSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Método para verificar se cliente está completamente validado
clientSchema.methods.isFullyValidated = function () {
  return this.isDocumentValidated && this.isPaymentVerified;
};

// Método para verificar se pode ser ativado
clientSchema.methods.canBeActivated = function () {
  return this.isDocumentValidated && this.isPaymentVerified && this.paymentStatus === 'approved';
};

// Create Client model
export const Client = mongoose.model('Client', clientSchema);
