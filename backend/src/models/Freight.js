import mongoose from 'mongoose';

// Freight schema for AgroConecta
const freightSchema = new mongoose.Schema({
  product: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    weight: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'ton', 'sacas'],
      default: 'kg'
    }
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
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
    country: {
      type: String,
      default: 'Brasil',
      trim: true
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
    country: {
      type: String,
      default: 'Brasil',
      trim: true
    }
  },
  truckType: {
    type: String,
    required: true,
    enum: ['truck', 'truck-truck', 'truck-truck-truck', 'truck-truck-truck-truck'],
    default: 'truck'
  },
  freightValue: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryTime: {
    type: Number,
    required: true,
    min: 1 // days
  },
  carrier: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    cpfCnpj: {
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
    truckLicensePlate: {
      type: String,
      required: true,
      trim: true
    }
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'in_negotiation', 'assigned', 'in_transit', 'delivered', 'cancelled'],
    default: 'available'
  },
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
freightSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create Freight model
export const Freight = mongoose.model('Freight', freightSchema);
