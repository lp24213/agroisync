import mongoose from 'mongoose';

const partnershipMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  partnershipType: {
    type: String,
    enum: ['technology', 'distribution', 'marketing', 'research', 'investment', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  goals: {
    type: String,
    trim: true
  },
  budget: {
    type: String,
    enum: ['under_10k', '10k_50k', '50k_100k', '100k_500k', 'over_500k', 'negotiable'],
    default: 'negotiable'
  },
  timeline: {
    type: String,
    enum: ['immediate', '1_3_months', '3_6_months', '6_12_months', 'over_1_year'],
    default: '3_6_months'
  },
  status: {
    type: String,
    enum: ['new', 'reviewing', 'contacted', 'negotiating', 'accepted', 'rejected'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminNotes: {
    type: String,
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  contactedAt: {
    type: Date
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
partnershipMessageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Método para marcar como lido
partnershipMessageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Método para marcar como contactado
partnershipMessageSchema.methods.markAsContacted = function() {
  this.status = 'contacted';
  this.contactedAt = new Date();
  return this.save();
};

// Método para atualizar status
partnershipMessageSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  return this.save();
};

export const PartnershipMessage = mongoose.model('PartnershipMessage', partnershipMessageSchema);
