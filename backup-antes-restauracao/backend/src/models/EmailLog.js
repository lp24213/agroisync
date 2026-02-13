import mongoose from 'mongoose';

const emailLogSchema = new mongoose.Schema(
  {
    provider: { type: String, required: true, default: 'resend' },
    to: { type: String, required: true, index: true },
    subject: { type: String, required: true, index: true },
    messageId: { type: String, default: null, index: true },
    status: { type: String, required: true, enum: ['sent', 'error'] },
    error: { type: String, default: null },
    meta: { type: Object, default: {} }
  },
  { timestamps: true }
);

emailLogSchema.index({ createdAt: -1 });

const EmailLog = mongoose.model('EmailLog', emailLogSchema);

export default EmailLog;
