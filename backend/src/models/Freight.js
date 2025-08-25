import mongoose from 'mongoose';

// Freight schema for freight providers
const freightSchema = new mongoose.Schema({
  // Provider Information
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Freight Basic Information
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },

  // Origin and Destination
  origin: {
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
    address: String,
    coordinates: {
      lat: Number,
      lon: Number
    }
  },

  destination: {
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
    address: String,
    coordinates: {
      lat: Number,
      lon: Number
    }
  },

  // Freight Details
  cargoType: {
    type: String,
    required: true,
    enum: ['grains', 'vegetables', 'fruits', 'livestock', 'machinery', 'fertilizers', 'general'],
    default: 'general'
  },

  weight: {
    min: {
      type: Number,
      required: true,
      min: 0
    },
    max: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['kg', 'ton'],
      default: 'kg'
    }
  },

  volume: {
    min: {
      type: Number,
      min: 0
    },
    max: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      enum: ['m3', 'm2'],
      default: 'm3'
    }
  },

  // Vehicle Information
  vehicleType: {
    type: String,
    required: true,
    enum: ['truck', 'pickup', 'van', 'tractor', 'trailer', 'other'],
    default: 'truck'
  },

  vehicleCapacity: {
    weight: Number,
    volume: Number,
    unit: String
  },

  // Pricing
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'BRL'
  },
  priceType: {
    type: String,
    enum: ['fixed', 'per_km', 'per_ton', 'negotiable'],
    default: 'fixed'
  },

  // Additional Costs
  additionalCosts: [
    {
      description: String,
      amount: Number,
      currency: {
        type: String,
        default: 'BRL'
      }
    }
  ],

  // Availability and Scheduling
  availableFrom: {
    type: Date,
    required: true
  },
  availableUntil: {
    type: Date,
    required: true
  },

  // Requirements and Restrictions
  requirements: [
    {
      type: String,
      trim: true
    }
  ],

  restrictions: [
    {
      type: String,
      trim: true
    }
  ],

  // Insurance and Documentation
  insurance: {
    hasInsurance: {
      type: Boolean,
      default: false
    },
    coverage: String,
    amount: Number
  },

  documents: {
    hasLicense: {
      type: Boolean,
      default: false
    },
    hasInsurance: {
      type: Boolean,
      default: false
    },
    hasDocumentation: {
      type: Boolean,
      default: false
    }
  },

  // Status and Visibility
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'booked', 'completed', 'cancelled', 'moderation'],
    default: 'active'
  },

  isFeatured: {
    type: Boolean,
    default: false
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  // Analytics
  views: {
    type: Number,
    default: 0
  },

  inquiries: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      message: String,
      inquiredAt: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['pending', 'responded', 'accepted', 'rejected'],
        default: 'pending'
      }
    }
  ],

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
freightSchema.index({ providerId: 1 });
freightSchema.index({ 'origin.city': 1, 'origin.state': 1 });
freightSchema.index({ 'destination.city': 1, 'destination.state': 1 });
freightSchema.index({ cargoType: 1 });
freightSchema.index({ status: 1 });
freightSchema.index({ availableFrom: 1, availableUntil: 1 });
freightSchema.index({ price: 1 });
freightSchema.index({ createdAt: -1 });

// Middleware para atualizar timestamp
freightSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Middleware para validar limite de fretes
freightSchema.pre('save', async function (next) {
  if (this.isNew) {
    const User = mongoose.model('User');
    const provider = await User.findById(this.providerId);

    if (!provider) {
      return next(new Error('Prestador de frete não encontrado'));
    }

    if (!provider.hasActivePlan('freight')) {
      return next(new Error('Plano de frete não ativo'));
    }

    if (!provider.canCreateFreight()) {
      return next(new Error('Limite de fretes atingido'));
    }
  }

  next();
});

// Middleware para incrementar contador de fretes
freightSchema.post('save', async function (doc) {
  if (doc.isNew) {
    const User = mongoose.model('User');
    await User.findByIdAndUpdate(doc.providerId, {
      $inc: { 'subscriptions.freight.currentFreights': 1 }
    });
  }
});

// Middleware para decrementar contador de fretes
freightSchema.post('remove', async function (doc) {
  const User = mongoose.model('User');
  await User.findByIdAndUpdate(doc.providerId, {
    $inc: { 'subscriptions.freight.currentFreights': -1 }
  });
});

// Método para incrementar visualizações
freightSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Método para adicionar consulta
freightSchema.methods.addInquiry = function (userId, message) {
  this.inquiries.push({
    userId,
    message
  });
  return this.save();
};

// Método para responder consulta
freightSchema.methods.respondToInquiry = function (inquiryId, status) {
  const inquiry = this.inquiries.id(inquiryId);
  if (inquiry) {
    inquiry.status = status;
    return this.save();
  }
  throw new Error('Consulta não encontrada');
};

// Método para buscar fretes por rota
freightSchema.statics.findByRoute = function (
  originCity,
  originState,
  destCity,
  destState,
  limit = 20
) {
  return this.find({
    status: 'active',
    'origin.city': { $regex: originCity, $options: 'i' },
    'origin.state': { $regex: originState, $options: 'i' },
    'destination.city': { $regex: destCity, $options: 'i' },
    'destination.state': { $regex: destState, $options: 'i' },
    availableFrom: { $lte: new Date() },
    availableUntil: { $gte: new Date() }
  })
    .sort({ price: 1 })
    .limit(limit)
    .populate('providerId', 'name company.name');
};

// Método para buscar fretes por tipo de carga
freightSchema.statics.findByCargoType = function (cargoType, limit = 20) {
  return this.find({
    status: 'active',
    cargoType,
    availableFrom: { $lte: new Date() },
    availableUntil: { $gte: new Date() }
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('providerId', 'name company.name');
};

// Método para buscar fretes disponíveis
freightSchema.statics.findAvailable = function (filters = {}, limit = 20, skip = 0) {
  const query = {
    status: 'active',
    availableFrom: { $lte: new Date() },
    availableUntil: { $gte: new Date() }
  };

  // Aplicar filtros adicionais
  if (filters.originCity) query['origin.city'] = { $regex: filters.originCity, $options: 'i' };
  if (filters.originState) query['origin.state'] = { $regex: filters.originState, $options: 'i' };
  if (filters.destCity) query['destination.city'] = { $regex: filters.destCity, $options: 'i' };
  if (filters.destState) query['destination.state'] = { $regex: filters.destState, $options: 'i' };
  if (filters.cargoType) query.cargoType = filters.cargoType;
  if (filters.minWeight) query['weight.min'] = { $gte: filters.minWeight };
  if (filters.maxWeight) query['weight.max'] = { $lte: filters.maxWeight };
  if (filters.maxPrice) query.price = { $lte: filters.maxPrice };

  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('providerId', 'name company.name');
};

// Create Freight model
export const Freight = mongoose.model('Freight', freightSchema);
