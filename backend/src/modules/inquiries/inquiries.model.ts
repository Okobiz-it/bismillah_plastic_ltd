import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  // ─── Customer Information ─────────────────────────
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  phone: {
    type: String,
  },
  company: {
    type: String,
  },
  companyWebsite: {
    type: String,
  },
  companyAddress: {
    type: String,
  },
  deliveryAddress: {
    type: String,
  },
  country: {
    type: String,
  },
  designation: {
    type: String,
  },
  whatsapp: {
    type: String,
  },
  wechat: {
    type: String,
  },
  // ─── Product Requirements ─────────────────────────
  product: {
    type: String,
  },
  productGrade: {
    type: String,
  },
  quantity: {
    type: String,
  },
  requiredSpecification: {
    type: String,
  },
  targetDelivery: {
    type: String,
  },
  destinationPort: {
    type: String,
  },
  incoterm: {
    type: String,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
  fileUpload: {
    type: String,
  },
  // ─── System Fields ────────────────────────────────
  category: {
    type: String,
    enum: ['export', 'general'],
    default: 'general',
  },
  type: {
    type: String,
    enum: ['general', 'quote'],
    default: 'general',
  },
  inquiryType: {
    type: String,
    enum: ['Export Quote Request', 'General Inquiry'],
    default: 'General Inquiry',
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
  },
  brochureUrl: {
    type: String,
  },
  brochureName: {
    type: String,
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied'],
    default: 'new',
  }
}, { timestamps: true });

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
