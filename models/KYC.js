import mongoose from 'mongoose'

const KYCSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  documentType: {
    type: String,
    enum: ['id', 'address', 'license', 'vehicle', 'business'],
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  buffer: {
    type: Buffer,
    required: true
  },
  ocrText: {
    type: String,
    default: ''
  },
  ocrConfidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  validation: {
    isValid: {
      type: Boolean,
      default: false
    },
    score: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },
    foundPatterns: [{
      type: String
    }],
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    }
  },
  fraudDetection: {
    isFraud: {
      type: Boolean,
      default: false
    },
    fraudScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },
    indicators: [{
      type: String
    }]
  },
  status: {
    type: String,
    enum: ['pending_review', 'approved', 'rejected'],
    default: 'pending_review'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  reason: {
    type: String
  },
  notes: {
    type: String
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Indexes for better performance
KYCSchema.index({ userId: 1, documentType: 1 })
KYCSchema.index({ status: 1 })
KYCSchema.index({ uploadedAt: -1 })

// Virtual for document URL
KYCSchema.virtual('documentUrl').get(function() {
  return `/api/kyc/document/${this._id}`
})

// Method to get document summary
KYCSchema.methods.getSummary = function() {
  return {
    id: this._id,
    documentType: this.documentType,
    originalName: this.originalName,
    mimeType: this.mimeType,
    size: this.size,
    status: this.status,
    ocrConfidence: this.ocrConfidence,
    validation: {
      isValid: this.validation.isValid,
      score: this.validation.score,
      confidence: this.validation.confidence
    },
    fraudDetection: {
      isFraud: this.fraudDetection.isFraud,
      fraudScore: this.fraudDetection.fraudScore
    },
    uploadedAt: this.uploadedAt,
    reviewedAt: this.reviewedAt,
    reason: this.reason
  }
}

// Static method to get user KYC status
KYCSchema.statics.getUserKYCStatus = async function(userId, role) {
  const documents = await this.find({ userId })
  
  const requirements = this.getKYCRequirements(role)
  const documentTypes = documents.map(doc => doc.documentType)
  
  // Check if all required documents are present and approved
  const hasAllRequired = requirements.every(req => 
    documentTypes.includes(req.type) && 
    documents.find(doc => doc.documentType === req.type)?.status === 'approved'
  )
  
  if (hasAllRequired) return 'approved'
  
  // Check if any document is rejected
  const hasRejected = documents.some(doc => doc.status === 'rejected')
  if (hasRejected) return 'rejected'
  
  // Check if any document is pending
  const hasPending = documents.some(doc => doc.status === 'pending_review')
  if (hasPending) return 'pending_review'
  
  return 'incomplete'
}

// Static method to get KYC requirements by role
KYCSchema.statics.getKYCRequirements = function(role) {
  const baseRequirements = [
    { type: 'id', name: 'Documento de Identidade', required: true },
    { type: 'address', name: 'Comprovante de Endereço', required: true }
  ]
  
  const roleRequirements = {
    driver: [
      { type: 'license', name: 'Carteira de Habilitação', required: true },
      { type: 'vehicle', name: 'Documento do Veículo', required: true }
    ],
    seller: [
      { type: 'business', name: 'Documento da Empresa', required: true }
    ],
    buyer: []
  }
  
  return [...baseRequirements, ...(roleRequirements[role] || [])]
}

// Static method to get KYC statistics
KYCSchema.statics.getKYCStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ])
  
  const total = await this.countDocuments()
  
  return {
    total,
    pending: stats.find(s => s._id === 'pending_review')?.count || 0,
    approved: stats.find(s => s._id === 'approved')?.count || 0,
    rejected: stats.find(s => s._id === 'rejected')?.count || 0
  }
}

// Pre-save middleware
KYCSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.models.KYC || mongoose.model('KYC', KYCSchema)
