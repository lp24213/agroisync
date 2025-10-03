import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
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
      price: {
        type: Number,
        required: [true, 'PreÃ§o Ã© obrigatÃ³rio'],
        min: [0, 'PreÃ§o nÃ£o pode ser negativo']
      },
      currency: {
        type: String,
        default: 'BRL',
        enum: ['BRL', 'USD', 'EUR']
      },
      category: {
        type: String,
        required: [true, 'Categoria Ã© obrigatÃ³ria'],
        enum: ['grains', 'inputs', 'machinery', 'livestock', 'fruits', 'vegetables', 'other']
      },
      images: [
        {
          url: {
            type: String,
            required: true
          },
          alt: String,
          isMain: {
            type: Boolean,
            default: false
          }
        }
      ],
      city: {
        type: String,
        required: [true, 'Cidade Ã© obrigatÃ³ria'],
        trim: true
      },
      state: {
        type: String,
        required: [true, 'Estado Ã© obrigatÃ³rio'],
        trim: true,
        uppercase: true,
        minlength: 2,
        maxlength: 2
      },
      stock: {
        type: Number,
        required: [true, 'Estoque Ã© obrigatÃ³rio'],
        min: [0, 'Estoque nÃ£o pode ser negativo']
      },
      unit: {
        type: String,
        required: [true, 'Unidade Ã© obrigatÃ³ria'],
        enum: ['kg', 'ton', 'un', 'l', 'mÂ²', 'mÂ³', 'outro']
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
      documents: [
        {
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
        }
      ],
      paymentTerms: {
        type: String,
        enum: ['Ã  vista', '30 dias', '60 dias', '90 dias', 'negociÃ¡vel']
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
      required: [true, 'Vendedor Ã© obrigatÃ³rio']
    },

    // Status e controle
    status: {
      type: String,
      enum: ['active', 'inactive', 'sold', 'expired'],
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
        // Produto expira em 90 dias por padrÃ£o
        const date = new Date();
        date.setDate(date.getDate() + 90);
        return date;
      }
    }
  },
  {
    timestamps: true
  }
);

// Ãndices para performance
productSchema.index({ 'publicData.category': 1 });
productSchema.index({ 'publicData.city': 1, 'publicData.state': 1 });
productSchema.index({ 'publicData.price': 1 });
productSchema.index({ seller: 1 });
productSchema.index({ status: 1 });
productSchema.index({ 'publicData.isActive': 1 });
productSchema.index({ expiresAt: 1 });
productSchema.index({ createdAt: -1 });

// Middleware para verificar expiraÃ§Ã£o
productSchema.pre('find', function () {
  this.where('expiresAt').gt(new Date());
});

// MÃ©todo para obter dados pÃºblicos
productSchema.methods.getPublicData = function () {
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

// MÃ©todo para obter dados privados (apenas se usuÃ¡rio pagou)
productSchema.methods.getPrivateData = function (userId, userIsPaid) {
  if (!userIsPaid) {
    throw new Error('Acesso negado: usuÃ¡rio nÃ£o possui plano ativo');
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

// MÃ©todo para incrementar visualizaÃ§Ãµes
productSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// MÃ©todo para adicionar/remover favoritos
productSchema.methods.toggleFavorite = function (userId) {
  const index = this.favorites.indexOf(userId);
  if (index === -1) {
    this.favorites.push(userId);
  } else {
    this.favorites.splice(index, 1);
  }
  return this.save();
};

// MÃ©todo para verificar se produto estÃ¡ ativo
productSchema.methods.isActive = function () {
  return this.status === 'active' && this.publicData.isActive && new Date() < this.expiresAt;
};

const Product = mongoose.model('Product', productSchema);

export default Product;
