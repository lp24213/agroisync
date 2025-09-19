const mongoose = require('mongoose');

const freightOrderSchema = new mongoose.Schema(
  {
    // Identificação do pedido
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    
    // Partes envolvidas
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    carrierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    
    // Informações de origem e destino
    origin: {
      address: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number
      },
      contact: {
        name: String,
        phone: String,
        email: String
      }
    },
    
    destination: {
      address: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number
      },
      contact: {
        name: String,
        phone: String,
        email: String
      }
    },
    
    // Datas
    pickupDate: {
      type: Date,
      required: true
    },
    deliveryDateEstimate: {
      type: Date,
      required: true
    },
    deliveryDateActual: {
      type: Date,
      default: null
    },
    
    // Itens transportados
    items: [
      {
        name: {
          type: String,
          required: true
        },
        description: String,
        quantity: {
          type: Number,
          required: true
        },
        unit: {
          type: String,
          required: true
        },
        weight: Number,
        volume: Number,
        value: Number,
        category: {
          type: String,
          enum: ['grain', 'livestock', 'equipment', 'fertilizer', 'other'],
          default: 'other'
        }
      }
    ],
    
    // Status do frete
    status: {
      type: String,
      enum: [
        'pending',           // Aguardando aceitação
        'accepted',          // Aceito pelo transportador
        'picked_up',         // Coletado
        'in_transit',        // Em trânsito
        'delivered',         // Entregue
        'closed',            // Fechado
        'cancelled'          // Cancelado
      ],
      default: 'pending',
      index: true
    },
    
    // Eventos de rastreamento
    trackingEvents: [
      {
        timestamp: {
          type: Date,
          default: Date.now
        },
        location: {
          address: String,
          city: String,
          state: String,
          coordinates: {
            lat: Number,
            lng: Number
          }
        },
        status: {
          type: String,
          enum: [
            'created',
            'accepted',
            'picked_up',
            'in_transit',
            'delayed',
            'delivered',
            'exception'
          ],
          required: true
        },
        description: String,
        metadata: {
          driver: String,
          vehicle: String,
          notes: String,
          images: [String], // URLs das imagens de prova
          documents: [String] // URLs dos documentos
        }
      }
    ],
    
    // Informações financeiras
    pricing: {
      basePrice: {
        type: Number,
        required: true
      },
      additionalFees: [
        {
          name: String,
          amount: Number,
          description: String
        }
      ],
      totalPrice: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        default: 'BRL'
      }
    },
    
    // Informações do veículo
    vehicle: {
      plate: String,
      type: {
        type: String,
        enum: ['truck', 'trailer', 'van', 'other'],
        default: 'truck'
      },
      capacity: {
        weight: Number,
        volume: Number
      },
      driver: {
        name: String,
        phone: String,
        license: String
      }
    },
    
    // Documentos
    documents: [
      {
        type: {
          type: String,
          enum: ['invoice', 'bill_of_lading', 'receipt', 'insurance', 'other'],
          required: true
        },
        url: String,
        filename: String,
        uploadedAt: {
          type: Date,
          default: Date.now
        },
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      }
    ],
    
    // Avaliação e fechamento
    rating: {
      buyerRating: {
        rating: {
          type: Number,
          min: 1,
          max: 5
        },
        comment: String,
        ratedAt: Date
      },
      sellerRating: {
        rating: {
          type: Number,
          min: 1,
          max: 5
        },
        comment: String,
        ratedAt: Date
      },
      carrierRating: {
        rating: {
          type: Number,
          min: 1,
          max: 5
        },
        comment: String,
        ratedAt: Date
      }
    },
    
    // Fechamento assistido por IA
    aiClosure: {
      summary: String,
      performanceMetrics: {
        onTimeDelivery: Boolean,
        damageReport: String,
        delayReason: String,
        overallScore: Number
      },
      suggestedMessage: String,
      invoiceDraft: String,
      isCompleted: {
        type: Boolean,
        default: false
      },
      completedAt: Date
    },
    
    // Notificações
    notifications: [
      {
        type: {
          type: String,
          enum: ['status_change', 'tracking_update', 'delivery_confirmation', 'rating_request'],
          required: true
        },
        message: String,
        sentTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        sentAt: {
          type: Date,
          default: Date.now
        },
        isRead: {
          type: Boolean,
          default: false
        }
      }
    ],
    
    // Configurações
    settings: {
      allowTrackingUpdates: {
        type: Boolean,
        default: true
      },
      requireDeliveryConfirmation: {
        type: Boolean,
        default: true
      },
      autoCloseAfterDays: {
        type: Number,
        default: 7
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Índices
freightOrderSchema.index({ buyerId: 1, createdAt: -1 });
freightOrderSchema.index({ sellerId: 1, createdAt: -1 });
freightOrderSchema.index({ carrierId: 1, createdAt: -1 });
freightOrderSchema.index({ status: 1, createdAt: -1 });
freightOrderSchema.index({ orderNumber: 1 });

// Virtuals
freightOrderSchema.virtual('isActive').get(function () {
  return !['closed', 'cancelled'].includes(this.status);
});

freightOrderSchema.virtual('isDelivered').get(function () {
  return this.status === 'delivered' || this.status === 'closed';
});

freightOrderSchema.virtual('daysInTransit').get(function () {
  if (!this.trackingEvents.length) return 0;
  
  const pickupEvent = this.trackingEvents.find(e => e.status === 'picked_up');
  const deliveryEvent = this.trackingEvents.find(e => e.status === 'delivered');
  
  if (!pickupEvent || !deliveryEvent) return 0;
  
  return Math.ceil((deliveryEvent.timestamp - pickupEvent.timestamp) / (1000 * 60 * 60 * 24));
});

freightOrderSchema.virtual('isOverdue').get(function () {
  return this.status === 'in_transit' && new Date() > this.deliveryDateEstimate;
});

// Middleware pre-save
freightOrderSchema.pre('save', function (next) {
  // Gerar número do pedido se não existir
  if (this.isNew && !this.orderNumber) {
    this.orderNumber = `FR-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }
  
  // Calcular preço total
  if (this.pricing.basePrice) {
    const additionalFeesTotal = this.pricing.additionalFees.reduce((sum, fee) => sum + fee.amount, 0);
    this.pricing.totalPrice = this.pricing.basePrice + additionalFeesTotal;
  }
  
  next();
});

// Métodos de instância
freightOrderSchema.methods.addTrackingEvent = function (status, location, description, metadata = {}) {
  this.trackingEvents.push({
    timestamp: new Date(),
    location,
    status,
    description,
    metadata
  });
  
  // Atualizar status se necessário
  if (['picked_up', 'in_transit', 'delivered'].includes(status)) {
    this.status = status === 'picked_up' ? 'in_transit' : status;
  }
  
  return this.save();
};

freightOrderSchema.methods.updateStatus = function (newStatus, reason = '') {
  this.status = newStatus;
  
  // Adicionar evento de rastreamento
  this.addTrackingEvent(newStatus, {}, reason);
  
  return this.save();
};

freightOrderSchema.methods.addDocument = function (type, url, filename, uploadedBy) {
  this.documents.push({
    type,
    url,
    filename,
    uploadedBy
  });
  
  return this.save();
};

freightOrderSchema.methods.rateUser = function (userType, rating, comment, ratedBy) {
  const ratingField = `${userType}Rating`;
  this.rating[ratingField] = {
    rating,
    comment,
    ratedAt: new Date()
  };
  
  return this.save();
};

freightOrderSchema.methods.completeAIClosure = function (summary, metrics, suggestedMessage, invoiceDraft) {
  this.aiClosure = {
    summary,
    performanceMetrics: metrics,
    suggestedMessage,
    invoiceDraft,
    isCompleted: true,
    completedAt: new Date()
  };
  
  this.status = 'closed';
  
  return this.save();
};

// Métodos estáticos
freightOrderSchema.statics.findByUserId = function (userId) {
  return this.find({
    $or: [
      { buyerId: userId },
      { sellerId: userId },
      { carrierId: userId }
    ]
  }).sort({ createdAt: -1 });
};

freightOrderSchema.statics.findByStatus = function (status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

freightOrderSchema.statics.findActiveOrders = function () {
  return this.find({
    status: { $in: ['pending', 'accepted', 'picked_up', 'in_transit'] }
  }).sort({ createdAt: -1 });
};

freightOrderSchema.statics.findOverdueOrders = function () {
  return this.find({
    status: 'in_transit',
    deliveryDateEstimate: { $lt: new Date() }
  }).sort({ deliveryDateEstimate: 1 });
};

module.exports = mongoose.model('FreightOrder', freightOrderSchema);
