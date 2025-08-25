import mongoose from 'mongoose';

// Product schema for sellers
const productSchema = new mongoose.Schema({
  // Seller Information
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Product Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  summary: {
    type: String,
    trim: true
  },

  // Product Details
  category: {
    type: String,
    required: true,
    enum: [
      'grains',
      'vegetables',
      'fruits',
      'livestock',
      'machinery',
      'fertilizers',
      'seeds',
      'tools',
      'other'
    ],
    default: 'other'
  },
  subcategory: {
    type: String,
    trim: true
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
    enum: ['fixed', 'negotiable', 'auction', 'per_unit'],
    default: 'fixed'
  },
  unit: {
    type: String,
    enum: ['kg', 'ton', 'unit', 'box', 'bag', 'liter', 'other'],
    default: 'kg'
  },

  // Quantity and Availability
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    available: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['kg', 'ton', 'unit', 'box', 'bag', 'liter', 'other'],
      default: 'kg'
    }
  },

  // Specifications
  specifications: {
    type: Map,
    of: String
  },
  quality: {
    type: String,
    enum: ['premium', 'standard', 'basic'],
    default: 'standard'
  },

  // Images and Media
  images: [
    {
      url: {
        type: String,
        required: true
      },
      alt: String,
      isPrimary: {
        type: Boolean,
        default: false
      },
      order: {
        type: Number,
        default: 0
      }
    }
  ],

  // Location and Shipping
  location: {
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
    coordinates: {
      lat: Number,
      lon: Number
    }
  },

  shipping: {
    available: {
      type: Boolean,
      default: true
    },
    methods: [
      {
        type: String,
        enum: ['pickup', 'delivery', 'freight']
      }
    ],
    cost: {
      type: Number,
      min: 0
    }
  },

  // Status and Visibility
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'sold', 'expired', 'moderation'],
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

  // SEO and Search
  tags: [
    {
      type: String,
      trim: true
    }
  ],
  keywords: [
    {
      type: String,
      trim: true
    }
  ],

  // Analytics
  views: {
    type: Number,
    default: 0
  },
  favorites: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      addedAt: {
        type: Date,
        default: Date.now
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
  },
  expiresAt: {
    type: Date
  }
});

// Índices para melhor performance
productSchema.index({ sellerId: 1 });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ status: 1 });
productSchema.index({ location: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ tags: 1 });
productSchema.index({ 'location.city': 1, 'location.state': 1 });

// Middleware para atualizar timestamp
productSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Middleware para validar limite de anúncios
productSchema.pre('save', async function (next) {
  if (this.isNew) {
    const User = mongoose.model('User');
    const seller = await User.findById(this.sellerId);

    if (!seller) {
      return next(new Error('Vendedor não encontrado'));
    }

    if (!seller.hasActivePlan('store')) {
      return next(new Error('Plano de loja não ativo'));
    }

    if (!seller.canCreateAd()) {
      return next(new Error('Limite de anúncios atingido'));
    }
  }

  next();
});

// Middleware para incrementar contador de anúncios
productSchema.post('save', async function (doc) {
  if (doc.isNew) {
    const User = mongoose.model('User');
    await User.findByIdAndUpdate(doc.sellerId, {
      $inc: { 'subscriptions.store.currentAds': 1 }
    });
  }
});

// Middleware para decrementar contador de anúncios
productSchema.post('remove', async function (doc) {
  const User = mongoose.model('User');
  await User.findByIdAndUpdate(doc.sellerId, {
    $inc: { 'subscriptions.store.currentAds': -1 }
  });
});

// Método para incrementar visualizações
productSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Método para adicionar aos favoritos
productSchema.methods.addToFavorites = function (userId) {
  const existingIndex = this.favorites.findIndex(
    fav => fav.userId.toString() === userId.toString()
  );

  if (existingIndex === -1) {
    this.favorites.push({ userId });
    return this.save();
  }

  return this;
};

// Método para remover dos favoritos
productSchema.methods.removeFromFavorites = function (userId) {
  this.favorites = this.favorites.filter(fav => fav.userId.toString() !== userId.toString());
  return this.save();
};

// Método para verificar se está nos favoritos
productSchema.methods.isInFavorites = function (userId) {
  return this.favorites.some(fav => fav.userId.toString() === userId.toString());
};

// Método para obter produtos por categoria
productSchema.statics.findByCategory = function (category, limit = 20, skip = 0) {
  return this.find({
    category,
    status: 'active'
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('sellerId', 'name company.name');
};

// Método para buscar produtos por texto
productSchema.statics.searchProducts = function (searchTerm, filters = {}, limit = 20, skip = 0) {
  const query = {
    status: 'active',
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } }
    ]
  };

  // Aplicar filtros adicionais
  if (filters.category) query.category = filters.category;
  if (filters.minPrice) query.price = { $gte: filters.minPrice };
  if (filters.maxPrice) query.price = { ...query.price, $lte: filters.maxPrice };
  if (filters.location) {
    query['location.city'] = { $regex: filters.location, $options: 'i' };
  }

  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('sellerId', 'name company.name');
};

// Método para obter produtos em destaque
productSchema.statics.getFeaturedProducts = function (limit = 10) {
  return this.find({
    status: 'active',
    isFeatured: true
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('sellerId', 'name company.name');
};

// Create Product model
export const Product = mongoose.model('Product', productSchema);
