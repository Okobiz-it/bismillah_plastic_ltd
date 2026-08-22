import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Product image is required'],
  },
  images: [{
    type: String,
  }],
  featured: {
    type: Boolean,
    default: false,
  },
  origin: {
    type: String,
    default: 'Bangladesh',
  },
  // ─── Material Information ─────────────────────────
  materialType: { type: String, default: '' },
  color: { type: String, default: '' },
  processingType: { type: String, default: '' },
  chipSize: { type: String, default: '' },
  gradeQuality: { type: String, default: '' },
  // ─── Technical Specifications ─────────────────────
  technicalSpecs: {
    iv: { type: String, default: '' },
    moisture: { type: String, default: '' },
    pvc: { type: String, default: '' },
    fines: { type: String, default: '' },
    contamination: { type: String, default: '' },
    bulkDensity: { type: String, default: '' },
    meltFlowIndex: { type: String, default: '' },
    otherParams: { type: String, default: '' },
  },
  // ─── Commercial Information ───────────────────────
  sku: { type: String, default: '' },
  moq: { type: String, default: '' },
  leadTime: { type: String, default: '' },
  stockStatus: { type: String, default: 'Available' },
  packaging: { type: String, default: '' },
  paymentTerms: { type: String, default: '' },
  shippingTerms: { type: String, default: '' },
  // ─── Supply Information ───────────────────────────
  monthlyProductionCapacity: { type: String, default: '' },
  availableCapacity: { type: String, default: '' },
  // ─── Export & Applications ────────────────────────
  exportMarkets: { type: String, default: '' },
  applications: { type: String, default: '' },
  hsCode: { type: String, default: '' },
  certifications: { type: String, default: '' },
  specifications: { type: String, default: '' },
  // ─── Documentation ───────────────────────────────
  tdsUrl: { type: String, default: '' },
  catalogueUrl: { type: String, default: '' },
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
