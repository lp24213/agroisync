import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
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
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['general', 'support', 'business', 'technical', 'other'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
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
  repliedAt: {
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
contactMessageSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// MÃ©todo para marcar como lido
contactMessageSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.readAt = new Date();
  this.status = 'read';
  return this.save();
};

// MÃ©todo para marcar como respondido
contactMessageSchema.methods.markAsReplied = function () {
  this.status = 'replied';
  this.repliedAt = new Date();
  return this.save();
};

// MÃ©todo para fechar ticket
contactMessageSchema.methods.close = function () {
  this.status = 'closed';
  return this.save();
};

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;
