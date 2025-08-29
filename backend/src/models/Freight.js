const mongoose = require('mongoose');

const freightSchema = new mongoose.Schema({
  // Dados Públicos (visíveis para todos)
  publicData: {
    title: {
      type: String,
      required: [true, 'Título é obrigatório'],
      trim: true,
      maxlength: [200, 'Título não pode ter mais de 200 caracteres']
    },
    shortDescription: {
      type: String,
      required: [true, 'Descrição curta é obrigatória'],
      trim: true,
      maxlength: [500, 'Descrição não pode ter mais de 500 caracteres']
    },
    originCity: {
      type: String,
      required: [true, 'Cidade de origem é obrigatória'],
      trim: true
    },
    originState: {
      type: String,
      required: [true, 'Estado de origem é obrigatório'],
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 2
    },
    destinationCity: {
      type: String,
      required: [true, 'Cidade de destino é obrigatória'],
      trim: true
    },
    destinationState: {
      type: String,
      required: [true, 'Estado de destino é obrigatório'],
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 2
    },
    freightValue: {
      type: Number,
      required: [true, 'Valor do frete é obrigatório'],
      min: [0, 'Valor não pode ser negativo']
    },
    currency: {
      type: String,
      default: 'BRL',
      enum: ['BRL', 'USD', 'EUR']
    },
    freightType: {
      type: String,
      required: [true, 'Tipo de frete é obrigatório'],
      enum: ['carga_completa', 'carga_fracionada', 'expresso', 'agendado']
    },
    weight: {
      type: Number,
      required: [true, 'Peso é obrigatório'],
      min: [0, 'Peso não pode ser negativo']
    },
    weightUnit: {
      type: String,
      default: 'kg',
      enum: ['kg', 'ton']
    },
    volume: {
      type: Number,
      min: [0, 'Volume não pode ser negativo']
    },
    volumeUnit: {
      type: String,
      default: 'm³',
      enum: ['m³', 'm²', 'l']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    featured: {
      type: Boolean,
      default: false
    }
  },

  // Dados Privados (visíveis apenas após pagamento)
  privateData: {
    fullDescription: {
      type: String,
      trim: true,
      maxlength: [2000, 'Descrição completa não pode ter mais de 2000 caracteres']
    },
    detailedRoute: {
      waypoints: [{
        city: String,
        state: String,
        estimatedTime: String
      }],
      totalDistance: Number,
      estimatedDuration: String,
      tolls: Number,
      fuelCost: Number
    },
    carrierInfo: {
      name: {
        type: String,
        required: true,
        trim: true
      },
      phone: {
        type: String,
        required: true,
        trim: true
      },
      email: {
        type: String,
        required: true,
        trim: true
      },
      cpfCnpj: {
        type: String,
        required: true,
        trim: true
      },
      ie: String,
      address: {
        street: String,
        number: String,
        complement: String,
        city: String,
        state: String,
        cep: String
      }
    },
    vehicleInfo: {
      plate: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
      },
      type: {
        type: String,
        required: true,
        enum: ['truck', 'pickup', 'van', 'tractor', 'trailer', 'other']
      },
      axles: {
        type: Number,
        required: true,
        min: [2, 'Mínimo de 2 eixos'],
        max: [9, 'Máximo de 9 eixos']
      },
      capacity: {
        weight: Number,
        volume: Number
      },
      year: Number,
      brand: String,
      model: String
    },
    documents: [{
      type: {
        type: String,
        enum: ['cnh', 'crlv', 'antt', 'seguro', 'outro'],
        required: true
      },
      url: {
        type: String,
        required: true
      },
      filename: String,
      description: String,
      expiresAt: Date
    }],
    insurance: {
      hasInsurance: {
        type: Boolean,
        default: false
      },
      company: String,
      policyNumber: String,
      coverage: String,
      expiresAt: Date
    },
    paymentTerms: {
      type: String,
      enum: ['à vista', '30 dias', '60 dias', '90 dias', 'negociável']
    },
    specialRequirements: [String]
  },

  // Relacionamentos
  carrier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Transportador é obrigatório']
  },

  // Status e controle
  status: {
    type: String,
    enum: ['active', 'inactive', 'in_transit', 'completed', 'cancelled'],
    default: 'active'
  },

  // Métricas
  views: {
    type: Number,
    default: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Timestamps
  expiresAt: {
    type: Date,
    default: function() {
      // Frete expira em 30 dias por padrão
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    }
  }
}, {
  timestamps: true
});

// Índices para performance
freightSchema.index({ 'publicData.originCity': 1, 'publicData.originState': 1 });
freightSchema.index({ 'publicData.destinationCity': 1, 'publicData.destinationState': 1 });
freightSchema.index({ 'publicData.freightValue': 1 });
freightSchema.index({ 'publicData.freightType': 1 });
freightSchema.index({ carrier: 1 });
freightSchema.index({ status: 1 });
freightSchema.index({ 'publicData.isActive': 1 });
freightSchema.index({ expiresAt: 1 });
freightSchema.index({ createdAt: -1 });

// Middleware para verificar expiração
freightSchema.pre('find', function() {
  this.where('expiresAt').gt(new Date());
});

// Método para obter dados públicos
freightSchema.methods.getPublicData = function() {
  return {
    _id: this._id,
    ...this.publicData,
    carrier: {
      name: this.privateData.carrierInfo.name,
      city: this.privateData.carrierInfo.address?.city || 'Não informado',
      state: this.privateData.carrierInfo.address?.state || 'Não informado'
    },
    createdAt: this.createdAt,
    expiresAt: this.expiresAt
  };
};

// Método para obter dados privados (apenas se usuário pagou)
freightSchema.methods.getPrivateData = function(userId, userIsPaid) {
  if (!userIsPaid) {
    throw new Error('Acesso negado: usuário não possui plano ativo');
  }

  return {
    _id: this._id,
    ...this.publicData,
    ...this.privateData,
    carrier: this.privateData.carrierInfo,
    createdAt: this.createdAt,
    expiresAt: this.expiresAt,
    views: this.views,
    favorites: this.favorites.length
  };
};

// Método para incrementar visualizações
freightSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Método para adicionar/remover favoritos
freightSchema.methods.toggleFavorite = function(userId) {
  const index = this.favorites.indexOf(userId);
  if (index === -1) {
    this.favorites.push(userId);
  } else {
    this.favorites.splice(index, 1);
  }
  return this.save();
};

// Método para verificar se frete está ativo
freightSchema.methods.isActive = function() {
  return this.status === 'active' && 
         this.publicData.isActive && 
         new Date() < this.expiresAt;
};

// Método para calcular distância estimada (simplificado)
freightSchema.methods.getEstimatedDistance = function() {
  // Implementar cálculo real de distância via API de geocoding
  // Por enquanto retorna valor estimado baseado nos estados
  const originState = this.publicData.originState;
  const destState = this.publicData.destinationState;
  
  if (originState === destState) return 'Mesmo estado';
  if (['SP', 'RJ', 'MG', 'ES'].includes(originState) && ['SP', 'RJ', 'MG', 'ES'].includes(destState)) return 'Região Sudeste';
  if (['RS', 'SC', 'PR'].includes(originState) && ['RS', 'SC', 'PR'].includes(destState)) return 'Região Sul';
  if (['GO', 'MT', 'MS', 'DF'].includes(originState) && ['GO', 'MT', 'MS', 'DF'].includes(destState)) return 'Região Centro-Oeste';
  if (['BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA'].includes(originState) && ['BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA'].includes(destState)) return 'Região Nordeste';
  if (['AM', 'PA', 'AP', 'TO', 'RO', 'AC', 'RR'].includes(originState) && ['AM', 'PA', 'AP', 'TO', 'RO', 'AC', 'RR'].includes(destState)) return 'Região Norte';
  
  return 'Interestadual';
};

const Freight = mongoose.model('Freight', freightSchema);

export default Freight;
