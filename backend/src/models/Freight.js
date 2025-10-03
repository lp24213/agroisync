import mongoose from 'mongoose';

const freightSchema = new mongoose.Schema(
  {
    // Dados PÃºblicos (visÃ­veis para todos)
    publicData: {
      title: {
        type: String,
        required: [true, 'TÃ­tulo Ã© obrigatÃ³rio'],
        trim: true,
        maxlength: [200, 'TÃ­tulo nÃ£o pode ter mais de 200 caracteres']
      },
      shortDescription: {
        type: String,
        required: [true, 'DescriÃ§Ã£o curta Ã© obrigatÃ³ria'],
        trim: true,
        maxlength: [500, 'DescriÃ§Ã£o nÃ£o pode ter mais de 500 caracteres']
      },
      originCity: {
        type: String,
        required: [true, 'Cidade de origem Ã© obrigatÃ³ria'],
        trim: true
      },
      originState: {
        type: String,
        required: [true, 'Estado de origem Ã© obrigatÃ³rio'],
        trim: true,
        uppercase: true,
        minlength: 2,
        maxlength: 2
      },
      destinationCity: {
        type: String,
        required: [true, 'Cidade de destino Ã© obrigatÃ³ria'],
        trim: true
      },
      destinationState: {
        type: String,
        required: [true, 'Estado de destino Ã© obrigatÃ³rio'],
        trim: true,
        uppercase: true,
        minlength: 2,
        maxlength: 2
      },
      freightValue: {
        type: Number,
        required: [true, 'Valor do frete Ã© obrigatÃ³rio'],
        min: [0, 'Valor nÃ£o pode ser negativo']
      },
      currency: {
        type: String,
        default: 'BRL',
        enum: ['BRL', 'USD', 'EUR']
      },
      freightType: {
        type: String,
        required: [true, 'Tipo de frete Ã© obrigatÃ³rio'],
        enum: ['carga_completa', 'carga_fracionada', 'expresso', 'agendado']
      },
      weight: {
        type: Number,
        required: [true, 'Peso Ã© obrigatÃ³rio'],
        min: [0, 'Peso nÃ£o pode ser negativo']
      },
      weightUnit: {
        type: String,
        default: 'kg',
        enum: ['kg', 'ton']
      },
      volume: {
        type: Number,
        min: [0, 'Volume nÃ£o pode ser negativo']
      },
      volumeUnit: {
        type: String,
        default: 'mÂ³',
        enum: ['mÂ³', 'mÂ²', 'l']
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

    // Dados Privados (visÃ­veis apenas apÃ³s pagamento)
    privateData: {
      fullDescription: {
        type: String,
        trim: true,
        maxlength: [2000, 'DescriÃ§Ã£o completa nÃ£o pode ter mais de 2000 caracteres']
      },
      detailedRoute: {
        waypoints: [
          {
            city: String,
            state: String,
            estimatedTime: String
          }
        ],
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
          min: [2, 'MÃ­nimo de 2 eixos'],
          max: [9, 'MÃ¡ximo de 9 eixos']
        },
        capacity: {
          weight: Number,
          volume: Number
        },
        year: Number,
        brand: String,
        model: String
      },
      documents: [
        {
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
        }
      ],
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
        enum: ['Ã  vista', '30 dias', '60 dias', '90 dias', 'negociÃ¡vel']
      },
      specialRequirements: [String]
    },

    // Relacionamentos
    carrier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Transportador Ã© obrigatÃ³rio']
    },

    // Status e controle
    status: {
      type: String,
      enum: ['active', 'inactive', 'in_transit', 'completed', 'cancelled'],
      default: 'active'
    },

    // MÃ©tricas
    views: {
      type: Number,
      default: 0
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    // Timestamps
    expiresAt: {
      type: Date,
      default() {
        // Frete expira em 30 dias por padrÃ£o
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return date;
      }
    }
  },
  {
    timestamps: true
  }
);

// Ãndices para performance
freightSchema.index({ 'publicData.originCity': 1, 'publicData.originState': 1 });
freightSchema.index({ 'publicData.destinationCity': 1, 'publicData.destinationState': 1 });
freightSchema.index({ 'publicData.freightValue': 1 });
freightSchema.index({ 'publicData.freightType': 1 });
freightSchema.index({ carrier: 1 });
freightSchema.index({ status: 1 });
freightSchema.index({ 'publicData.isActive': 1 });
freightSchema.index({ expiresAt: 1 });
freightSchema.index({ createdAt: -1 });

// Middleware para verificar expiraÃ§Ã£o
freightSchema.pre('find', function () {
  this.where('expiresAt').gt(new Date());
});

// MÃ©todo para obter dados pÃºblicos
freightSchema.methods.getPublicData = function () {
  return {
    _id: this._id,
    ...this.publicData,
    carrier: {
      name: this.privateData.carrierInfo.name,
      city: this.privateData.carrierInfo.address?.city || 'NÃ£o informado',
      state: this.privateData.carrierInfo.address?.state || 'NÃ£o informado'
    },
    createdAt: this.createdAt,
    expiresAt: this.expiresAt
  };
};

// MÃ©todo para obter dados privados (apenas se usuÃ¡rio pagou)
freightSchema.methods.getPrivateData = function (userId, userIsPaid) {
  if (!userIsPaid) {
    throw new Error('Acesso negado: usuÃ¡rio nÃ£o possui plano ativo');
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

// MÃ©todo para incrementar visualizaÃ§Ãµes
freightSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// MÃ©todo para adicionar/remover favoritos
freightSchema.methods.toggleFavorite = function (userId) {
  const index = this.favorites.indexOf(userId);
  if (index === -1) {
    this.favorites.push(userId);
  } else {
    this.favorites.splice(index, 1);
  }
  return this.save();
};

// MÃ©todo para verificar se frete estÃ¡ ativo
freightSchema.methods.isActive = function () {
  return this.status === 'active' && this.publicData.isActive && new Date() < this.expiresAt;
};

// MÃ©todo para calcular distÃ¢ncia estimada (simplificado)
freightSchema.methods.getEstimatedDistance = function () {
  // Implementar cÃ¡lculo real de distÃ¢ncia via API de geocoding
  // Por enquanto retorna valor estimado baseado nos estados
  const { originState } = this.publicData;
  const destState = this.publicData.destinationState;

  if (originState === destState) {
    return 'Mesmo estado';
  }
  if (
    ['SP', 'RJ', 'MG', 'ES'].includes(originState) &&
    ['SP', 'RJ', 'MG', 'ES'].includes(destState)
  ) {
    return 'RegiÃ£o Sudeste';
  }
  if (['RS', 'SC', 'PR'].includes(originState) && ['RS', 'SC', 'PR'].includes(destState)) {
    return 'RegiÃ£o Sul';
  }
  if (
    ['GO', 'MT', 'MS', 'DF'].includes(originState) &&
    ['GO', 'MT', 'MS', 'DF'].includes(destState)
  ) {
    return 'RegiÃ£o Centro-Oeste';
  }
  if (
    ['BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA'].includes(originState) &&
    ['BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA'].includes(destState)
  ) {
    return 'RegiÃ£o Nordeste';
  }
  if (
    ['AM', 'PA', 'AP', 'TO', 'RO', 'AC', 'RR'].includes(originState) &&
    ['AM', 'PA', 'AP', 'TO', 'RO', 'AC', 'RR'].includes(destState)
  ) {
    return 'RegiÃ£o Norte';
  }

  return 'Interestadual';
};

const Freight = mongoose.model('Freight', freightSchema);

export default Freight;
