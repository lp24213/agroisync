import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'driver', 'admin'],
    default: 'buyer',
  },
  phone: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  profileImage: String,
  rating: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: [String],
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stock: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  tags: [String],
  specifications: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Order Schema
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: String,
  trackingNumber: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Payment Schema
const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'BRL' },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: { type: String, required: true },
  stripePaymentIntentId: String,
  transactionId: String,
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Message Schema
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
  isRead: { type: Boolean, default: false },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  createdAt: { type: Date, default: Date.now },
});

// Freight Schema
const freightSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  origin: {
    address: String,
    city: String,
    state: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  destination: {
    address: String,
    city: String,
    state: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  cargo: {
    type: String,
    weight: Number,
    volume: Number,
    description: String,
  },
  price: { type: Number, required: true },
  currency: { type: String, default: 'BRL' },
  shipper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  carrier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['available', 'assigned', 'in_transit', 'delivered', 'cancelled'],
    default: 'available',
  },
  pickupDate: Date,
  deliveryDate: Date,
  trackingNumber: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// KYC Schema
const kycSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  documentType: {
    type: String,
    enum: ['cpf', 'cnpj', 'rg', 'passport'],
    required: true,
  },
  documentNumber: { type: String, required: true },
  documentImage: { type: String, required: true },
  selfieImage: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  rejectionReason: String,
  verifiedAt: Date,
  uploadedAt: { type: Date, default: Date.now },
  metadata: mongoose.Schema.Types.Mixed,
});

// Badge Schema
const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, default: '#3B82F6' },
  criteria: {
    type: {
      type: String,
      enum: ['orders', 'reviews', 'spending', 'referrals'],
      required: true,
    },
    threshold: { type: Number, required: true },
    period: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly', 'all_time'],
    },
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// User Badge Schema
const userBadgeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  badge: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge', required: true },
  earnedAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 },
});

// Review Schema
const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new',
  },
  reply: String,
  repliedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

// Create models
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
const Payment =
  mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
const Message =
  mongoose.models.Message || mongoose.model('Message', messageSchema);
const Freight =
  mongoose.models.Freight || mongoose.model('Freight', freightSchema);
const KYC = mongoose.models.KYC || mongoose.model('KYC', kycSchema);
const Badge = mongoose.models.Badge || mongoose.model('Badge', badgeSchema);
const UserBadge =
  mongoose.models.UserBadge || mongoose.model('UserBadge', userBadgeSchema);
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
const Contact =
  mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export {
  User,
  Product,
  Order,
  Payment,
  Message,
  Freight,
  KYC,
  Badge,
  UserBadge,
  Review,
  Contact,
};
