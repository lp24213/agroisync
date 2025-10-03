const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    // ProprietÃ¡rio do veÃ­culo
    carrierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // InformaÃ§Ãµes bÃ¡sicas
    plate: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },

    type: {
      type: String,
      enum: ['truck', 'trailer', 'van', 'pickup', 'other'],
      required: true
    },

    // EspecificaÃ§Ãµes tÃ©cnicas
    specifications: {
      brand: String,
      model: String,
      year: Number,
      color: String,
      chassisNumber: String,
      engineNumber: String,
      fuelType: {
        type: String,
        enum: ['diesel', 'gasoline', 'electric', 'hybrid', 'other'],
        default: 'diesel'
      }
    },

    // Capacidade
    capacity: {
      weight: {
        type: Number,
        required: true // em toneladas
      },
      volume: {
        type: Number,
        required: true // em metros cÃºbicos
      },
      dimensions: {
        length: Number, // em metros
        width: Number,
        height: Number
      }
    },

    // Documentos
    documents: [
      {
        type: {
          type: String,
          enum: [
            'registration', // CRLV
            'insurance', // Seguro
            'inspection', // Vistoria
            'license', // LicenÃ§a de transporte
            'permit', // PermissÃ£o
            'other'
          ],
          required: true
        },
        number: String,
        issueDate: Date,
        expiryDate: Date,
        url: String,
        filename: String,
        isActive: {
          type: Boolean,
          default: true
        }
      }
    ],

    // Status do veÃ­culo
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance', 'out_of_service'],
      default: 'active',
      index: true
    },

    // LocalizaÃ§Ã£o atual
    currentLocation: {
      address: String,
      city: String,
      state: String,
      coordinates: {
        lat: Number,
        lng: Number
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    },

    // Motorista atual
    currentDriver: {
      name: String,
      phone: String,
      license: String,
      assignedAt: Date
    },

    // HistÃ³rico de viagens
    trips: [
      {
        freightOrderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'FreightOrder'
        },
        startDate: Date,
        endDate: Date,
        origin: {
          city: String,
          state: String
        },
        destination: {
          city: String,
          state: String
        },
        status: {
          type: String,
          enum: ['scheduled', 'in_progress', 'completed', 'cancelled']
        }
      }
    ],

    // ManutenÃ§Ã£o
    maintenance: [
      {
        type: {
          type: String,
          enum: ['preventive', 'corrective', 'inspection', 'other'],
          required: true
        },
        description: String,
        date: {
          type: Date,
          required: true
        },
        cost: Number,
        mileage: Number,
        nextMaintenanceDate: Date,
        documents: [String] // URLs dos documentos
      }
    ],

    // Seguro
    insurance: {
      company: String,
      policyNumber: String,
      coverage: {
        type: String,
        enum: ['basic', 'comprehensive', 'full'],
        default: 'basic'
      },
      startDate: Date,
      endDate: Date,
      premium: Number,
      deductible: Number
    },

    // EstatÃ­sticas
    stats: {
      totalTrips: {
        type: Number,
        default: 0
      },
      totalDistance: {
        type: Number,
        default: 0 // em quilÃ´metros
      },
      totalHours: {
        type: Number,
        default: 0 // em horas
      },
      averageFuelConsumption: Number, // km/l
      lastMaintenanceDate: Date,
      nextMaintenanceDate: Date
    },

    // ConfiguraÃ§Ãµes
    settings: {
      allowTracking: {
        type: Boolean,
        default: true
      },
      requireDriverConfirmation: {
        type: Boolean,
        default: true
      },
      autoUpdateLocation: {
        type: Boolean,
        default: false
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Ãndices
vehicleSchema.index({ carrierId: 1, status: 1 });
vehicleSchema.index({ plate: 1 });
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ 'currentLocation.coordinates': '2dsphere' });

// Virtuals
vehicleSchema.virtual('isAvailable').get(function () {
  return this.status === 'active' && !this.currentDriver;
});

vehicleSchema.virtual('hasValidDocuments').get(function () {
  const requiredDocs = ['registration', 'insurance'];
  const activeDocs = this.documents.filter(doc => doc.isActive);

  return requiredDocs.every(reqDoc =>
    activeDocs.some(doc => doc.type === reqDoc && doc.expiryDate > new Date())
  );
});

vehicleSchema.virtual('needsMaintenance').get(function () {
  return this.stats.nextMaintenanceDate && this.stats.nextMaintenanceDate <= new Date();
});

vehicleSchema.virtual('insuranceExpired').get(function () {
  return this.insurance.endDate && this.insurance.endDate <= new Date();
});

// Middleware pre-save
vehicleSchema.pre('save', function (next) {
  // Atualizar estatÃ­sticas
  this.stats.totalTrips = this.trips.length;

  // Calcular prÃ³xima manutenÃ§Ã£o
  if (this.maintenance.length > 0) {
    const lastMaintenance = this.maintenance.sort((a, b) => b.date - a.date)[0];

    if (lastMaintenance.nextMaintenanceDate) {
      this.stats.nextMaintenanceDate = lastMaintenance.nextMaintenanceDate;
    }
  }

  next();
});

// MÃ©todos de instÃ¢ncia
vehicleSchema.methods.addTrip = function (freightOrderId, origin, destination) {
  this.trips.push({
    freightOrderId,
    startDate: new Date(),
    origin,
    destination,
    status: 'scheduled'
  });

  return this.save();
};

vehicleSchema.methods.updateLocation = function (location) {
  this.currentLocation = {
    ...location,
    lastUpdated: new Date()
  };

  return this.save();
};

vehicleSchema.methods.assignDriver = function (driverInfo) {
  this.currentDriver = {
    ...driverInfo,
    assignedAt: new Date()
  };

  return this.save();
};

vehicleSchema.methods.addMaintenance = function (maintenanceData) {
  this.maintenance.push({
    ...maintenanceData,
    date: new Date()
  });

  return this.save();
};

vehicleSchema.methods.addDocument = function (type, number, issueDate, expiryDate, url, filename) {
  this.documents.push({
    type,
    number,
    issueDate,
    expiryDate,
    url,
    filename,
    isActive: true
  });

  return this.save();
};

// MÃ©todos estÃ¡ticos
vehicleSchema.statics.findByCarrier = function (carrierId) {
  return this.find({ carrierId }).sort({ createdAt: -1 });
};

vehicleSchema.statics.findAvailable = function () {
  return this.find({
    status: 'active',
    currentDriver: { $exists: false }
  });
};

vehicleSchema.statics.findNearLocation = function (coordinates, maxDistance = 10000) {
  return this.find({
    'currentLocation.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates
        },
        $maxDistance: maxDistance
      }
    },
    status: 'active'
  });
};

vehicleSchema.statics.findNeedingMaintenance = function () {
  return this.find({
    'stats.nextMaintenanceDate': { $lte: new Date() }
  });
};

module.exports = mongoose.model('Vehicle', vehicleSchema);
