import mongoose from 'mongoose';

// News schema for agribusiness news
const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  summary: {
    type: String,
    required: true,
    trim: true
  },
  source: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      trim: true
    }
  },
  category: {
    type: String,
    required: true,
    enum: ['agriculture', 'commodities', 'technology', 'market', 'weather', 'policy'],
    default: 'agriculture'
  },
  tags: [
    {
      type: String,
      trim: true
    }
  ],
  imageUrl: {
    type: String,
    trim: true
  },
  publishedAt: {
    type: Date,
    required: true
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

// Weather schema for weather data
const weatherSchema = new mongoose.Schema({
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
    },
    coordinates: {
      lat: Number,
      lon: Number
    }
  },
  current: {
    temperature: {
      type: Number,
      required: true
    },
    feelsLike: Number,
    humidity: Number,
    pressure: Number,
    windSpeed: Number,
    windDirection: Number,
    description: String,
    icon: String
  },
  forecast: [
    {
      date: {
        type: Date,
        required: true
      },
      temperature: {
        min: Number,
        max: Number
      },
      description: String,
      icon: String,
      precipitation: Number
    }
  ],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índices para melhor performance
newsSchema.index({ category: 1, publishedAt: -1 });
newsSchema.index({ tags: 1 });
newsSchema.index({ isActive: 1 });

weatherSchema.index({ 'location.city': 1, 'location.state': 1 });
weatherSchema.index({ lastUpdated: -1 });

// Middleware para atualizar timestamp
newsSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

weatherSchema.pre('save', function (next) {
  this.lastUpdated = new Date();
  next();
});

// Método para obter notícias por categoria
newsSchema.statics.findByCategory = function (category, limit = 10) {
  return this.find({
    category,
    isActive: true
  })
    .sort({ publishedAt: -1 })
    .limit(limit);
};

// Método para obter notícias recentes
newsSchema.statics.findRecent = function (limit = 10) {
  return this.find({
    isActive: true
  })
    .sort({ publishedAt: -1 })
    .limit(limit);
};

// Método para obter clima por localização
weatherSchema.statics.findByLocation = function (city, state) {
  return this.findOne({
    'location.city': city,
    'location.state': state
  });
};

// Create models
const News = mongoose.model('News', newsSchema);
const Weather = mongoose.model('Weather', weatherSchema);

export { News, Weather };
