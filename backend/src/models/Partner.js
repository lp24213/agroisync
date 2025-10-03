import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
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
  website: {
    type: String,
    trim: true
  },
  logo: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['technology', 'agriculture', 'finance', 'logistics', 'marketing', 'research', 'other'],
    required: true
  },
  industry: {
    type: String,
    trim: true
  },
  founded: {
    type: Number
  },
  employees: {
    type: String,
    enum: ['1_10', '11_50', '51_200', '201_1000', 'over_1000']
  },
  location: {
    country: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    }
  },
  contact: {
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    contactPerson: {
      type: String,
      trim: true
    }
  },
  services: [
    {
      type: String,
      trim: true
    }
  ],
  certifications: [
    {
      name: String,
      issuer: String,
      validUntil: Date
    }
  ],
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'suspended'],
    default: 'active'
  },
  partnershipLevel: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  isFeatured: {
    type: Boolean,
    default: false
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

// Atualizar timestamp antes de salvar
partnerSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Ãndices para busca eficiente
partnerSchema.index({ name: 'text', description: 'text' });
partnerSchema.index({ category: 1, status: 1 });
partnerSchema.index({ 'location.country': 1, 'location.state': 1 });

// MÃ©todo para ativar parceiro
partnerSchema.methods.activate = function () {
  this.status = 'active';
  return this.save();
};

// MÃ©todo para desativar parceiro
partnerSchema.methods.deactivate = function () {
  this.status = 'inactive';
  return this.save();
};

// MÃ©todo para atualizar nÃ­vel de parceria
partnerSchema.methods.updatePartnershipLevel = function (level) {
  this.partnershipLevel = level;
  return this.save();
};

// MÃ©todo para marcar como destaque
partnerSchema.methods.toggleFeatured = function () {
  this.isFeatured = !this.isFeatured;
  return this.save();
};

const Partner = mongoose.model('Partner', partnerSchema);

export default Partner;
