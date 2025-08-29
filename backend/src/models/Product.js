import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
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
    price: {
      type: Number,
      required: [true, 'Preço é obrigatório'],
      min: [0, 'Preço não pode ser negativo']
    },
    currency: {
      type: String,
      default: 'BRL',
      enum: ['BRL', 'USD', 'EUR']
    },
    category: {
      type: String,
      required: [true, 'Categoria é obrigatória'],
      enum: ['grains', 'inputs', 'machinery', 'livestock', 'fruits', 'vegetables', 'other']
    },
    images: [{
      url: {
        type: String,
        required: true
      },
      alt: String,
      isMain: {
        type: Boolean,
        default: false
      }
    }],
    city: {
      type: String,
      required: [true, 'Cidade é obrigatória'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Estado é obrigatório'],
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 2
    },
    stock: {
      type: Number,
      required: [true, 'Estoque é obrigatório'],
      min: [0, 'Estoque não pode ser negativo']
    },
    unit: {
      type: String,
      required: [true, 'Unidade é obrigatória'],
      enum: ['kg', 'ton', 'un', 'l', 'm²', 'm³', 'outro']
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
    specifications: {
      type: Map,
      of: String
    },
    sellerInfo: {
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
    documents: [{
      type: {
        type: String,
        enum: ['certificado', 'laudo', 'foto', 'outro'],
        required: true
      },
      url: {
        type: String,
        required: true
      },
      filename: String,
      description: String
    }],
    paymentTerms: {
      type: String,
      enum: ['à vista', '30 dias', '60 dias', '90 dias', 'negociável']
    },
    deliveryInfo: {
      available: {
        type: Boolean,
        default: true
      },
      cost: Number,
      estimatedDays: Number,
      regions: [String]
    }
  },

  // Relacionamentos
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vendedor é obrigatório']
  },

  // Status e controle
  status: {
    type: String,
    enum: ['active', 'inactive', 'sold', 'expired'],
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
      // Produto expira em 90 dias por padrão
      const date = new Date();
      date.setDate(date.getDate() + 90);
      return date;
    }
  }
}, {
  timestamps: true
});

// Índices para performance
productSchema.index({ 'publicData.category': 1 });
productSchema.index({ 'publicData.city': 1, 'publicData.state': 1 });
productSchema.index({ 'publicData.price': 1 });
productSchema.index({ seller: 1 });
productSchema.index({ status: 1 });
productSchema.index({ 'publicData.isActive': 1 });
productSchema.index({ expiresAt: 1 });
productSchema.index({ createdAt: -1 });

// Middleware para verificar expiração
productSchema.pre('find', function() {
  this.where('expiresAt').gt(new Date());
});

// Método para obter dados públicos
productSchema.methods.getPublicData = function() {
  return {
    _id: this._id,
    ...this.publicData,
    seller: {
      name: this.privateData.sellerInfo.name,
      city: this.publicData.city,
      state: this.publicData.state
    },
    createdAt: this.createdAt,
    expiresAt: this.expiresAt
  };
};

// Método para obter dados privados (apenas se usuário pagou)
productSchema.methods.getPrivateData = function(userId, userIsPaid) {
  if (!userIsPaid) {
    throw new Error('Acesso negado: usuário não possui plano ativo');
  }

  return {
    _id: this._id,
    ...this.publicData,
    ...this.privateData,
    seller: this.privateData.sellerInfo,
    createdAt: this.createdAt,
    expiresAt: this.expiresAt,
    views: this.views,
    favorites: this.favorites.length
  };
};

// Método para incrementar visualizações
productSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Método para adicionar/remover favoritos
productSchema.methods.toggleFavorite = function(userId) {
  const index = this.favorites.indexOf(userId);
  if (index === -1) {
    this.favorites.push(userId);
  } else {
    this.favorites.splice(index, 1);
  }
  return this.save();
};

// Método para verificar se produto está ativo
productSchema.methods.isActive = function() {
  return this.status === 'active' && 
         this.publicData.isActive && 
         new Date() < this.expiresAt;
};

const Product = mongoose.model('Product', productSchema);

export default Product;
