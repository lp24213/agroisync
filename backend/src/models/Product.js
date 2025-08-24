import mongoose from 'mongoose';

// Product schema for Loja de Produtos
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['soja', 'milho', 'café', 'algodão', 'insumo', 'maquinário'],
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  minimumQuantity: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  quality: {
    protein: {
      type: Number,
      min: 0,
      max: 100
    },
    humidity: {
      type: Number,
      min: 0,
      max: 100
    },
    impurities: {
      type: Number,
      min: 0,
      max: 100
    },
    color: {
      type: String,
      trim: true
    }
  },
  seller: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    cpfCnpj: {
      type: String,
      required: true,
      trim: true
    }
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
    country: {
      type: String,
      default: 'Brasil',
      trim: true
    }
  },
  images: [{
    type: String, // SVG URLs
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
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

// Update timestamp before saving
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create Product model
export const Product = mongoose.model('Product', productSchema);
